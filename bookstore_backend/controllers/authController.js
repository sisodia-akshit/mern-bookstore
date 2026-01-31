const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/email");
const VerifiedEmail = require("../models/VerifiedEmail");
const CustomError = require("../utils/CustomError");
const RefreshToken = require("../models/RefreshToken");

const signAccessToken = (id) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters");
  }

  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
const signRefreshToken = (id) => {
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be set and at least 32 characters");
  }

  return jwt.sign({ id, type: "refresh" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const createSendResponse = async (res, code, user) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Option A: Store refresh token in DB (for revocation)
  await RefreshToken.create({
    token: crypto.createHash("sha256").update(refreshToken).digest("hex"),
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15min
    path: "/",
  };

  const cookieName = isProduction ? "__Host-token" : "token";
  const refreshCookieName = isProduction ? "__Host-refreshToken" : "refreshToken";
  res.cookie(cookieName, accessToken, options);
  res.cookie(refreshCookieName, refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  // res.status(code).json({ status: "success" });
};

// REGISTER
exports.register = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  const isUserExist = await User.findOne({ email: normalizedEmail });
  if (isUserExist) {
    throw new CustomError("Email Id already exist.", 400);
  }

  const verified = await VerifiedEmail.findOne({ email: normalizedEmail });
  if (!verified) {
    throw new CustomError("Email not verified or verification expired", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [user] = await User.create(
      [
        {
          name,
          email: normalizedEmail,
          password,
        },
      ],
      { session },
    );

    await VerifiedEmail.deleteOne({ email: normalizedEmail }, { session });

    await session.commitTransaction();
    session.endSession();

    await createSendResponse(res, 201, user);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      throw new CustomError("Email already exists", 400);
    }

    throw error;
  }
});

// LOGIN
exports.login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail, isActive: true }).select("+password");

  if (!user) {
    await bcrypt.hash(password, 12);
    throw new CustomError("Invalid email or password", 401);
  }

  if (user.provider !== "local") {
    throw new CustomError("Use Google login", 400);
  }

  if (user.isLockedOut()) {
    throw new CustomError("Account temporarily locked. Try again later.", 423);
  }

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) {
    user.loginAttempts = Math.min((user.loginAttempts || 0) + 1, 5);
    if (user.loginAttempts >= 5) {
      user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
    }
    await user.save({ validateBeforeSave: false });
    throw new CustomError("Invalid email or password", 401);
  }

  user.loginAttempts = 0;
  user.lockoutUntil = undefined;
  await user.save({ validateBeforeSave: false });

  await createSendResponse(res, 200, user);
});

exports.forgetPassword = asyncErrorHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "If an account exists, a reset link has been sent to the email.",
    });
  }
  if (user.provider !== "local") {
    throw new CustomError("Use Google login", 400);
  }

  if (
    user.passwordResetTokenExpires &&
    user.passwordResetTokenExpires > Date.now() - 2 * 60 * 1000
  ) {
    throw new CustomError("Please wait before requesting again.", 429);
  }

  const resetToken = await user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.ADMIN_URL}/login/reset-password/${resetToken}`;
  const html = `<p>We have received a password resetting request.</p>
                </br>
                 <p>Please click on the link to reset your password:</p>
                 </br></br>
                 <p>${resetUrl} </p>
                 </br></br>
                 <p>This reset password link will be valid for only 10 min.</p>
                 </br></br>
                 <p>Regards,</p>
                 <p>BookStore Team</p>
                 `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password resetting request received",
      html,
    });

    res.status(200).json({
      status: "success",
      message: "If an account exists, a reset link has been sent to the email.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new CustomError("Error sending email. Please try again later.", 500);
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("Invalid token or expired token", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  user.loginAttempts = 0;
  user.lockoutUntil = undefined;
  await user.save();
  await createSendResponse(res, 200, user);
});

exports.logout = asyncErrorHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  };

  const tokenName = process.env.NODE_ENV === "production" ? "__Host-token" : "token";
  const refreshTokenName = process.env.NODE_ENV === "production" ? "__Host-refreshToken" : "refreshToken";

  res.cookie(tokenName, "", cookieOptions);
  res.cookie(refreshTokenName, "", cookieOptions);

  if (req.user) {
    await RefreshToken.deleteMany({ user: req.user._id });
  }

  res.json({ message: "Logged out" });
});

exports.generateOtp = asyncErrorHandler(async (req, res) => {
  const { name, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  const isUserExist = await User.findOne({ email: normalizedEmail });
  if (isUserExist) {
    throw new CustomError("Email Id already exist.", 400);
  }
  const record = await OTP.findOne({ email: normalizedEmail });
  if (record && record.createdAt > Date.now() - 2 * 60 * 1000) {
    throw new CustomError("Please wait before requesting again.", 429);
  }

  // create OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.findOneAndUpdate(
    { email: normalizedEmail },
    {
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    },
    { upsert: true, new: true }, //it will create or updates *****
  );

  const html = `
                <h2>Email Verification</h2>
                <br/>
                <p>Your OTP verification code for BookStore signup is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 5 minutes.</p>
                <br/>
                <br/>
                <p>If you did not request this, please ignore this email.</p>
                <br/>
                <br/>
                <p>Regards,</p>
                <p>BookStore Team</p>
                `;

  try {
    await sendEmail({
      email: normalizedEmail,
      subject: "Email Verification Code",
      html,
    });

    res.status(200).json({
      status: "success",
      signupForm: {
        name,
        email: normalizedEmail,
      },
      otpSentTo: normalizedEmail,
    });
  } catch (error) {
    throw new CustomError("Error sending email. Please try again later.", 500);
  }
});

exports.verifyOtp = asyncErrorHandler(async (req, res) => {
  const { otp, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  const record = await OTP.findOne({
    email: normalizedEmail,
    expiresAt: { $gt: Date.now() },
  });

  if (!record) {
    throw new CustomError("OTP expired or Authentication timeout!", 400);
  }

  if (record.attempts >= 5) {
    await OTP.deleteOne({ email: normalizedEmail });
    throw new CustomError("Too many attempts. Request new OTP.", 429);
  }

  if (!record.isOtpValid(otp)) {
    await OTP.updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
    throw new CustomError("Invalid OTP", 400);
  }

  await OTP.deleteOne({ email: normalizedEmail });

  await VerifiedEmail.findOneAndUpdate({ email: normalizedEmail }, {}, { upsert: true });

  res.status(200).json({
    message: "Email verified successfully.",
  });
});

exports.refreshToken = asyncErrorHandler(async (req, res) => {
  const refreshCookieName = process.env.NODE_ENV === "production" ? "__Host-refreshToken" : "refreshToken";
  const refreshToken = req.cookies[refreshCookieName];

  if (!refreshToken) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (decoded.type !== "refresh") {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Optional: Check if token exists in DB (for revocation)
  const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const stored = await RefreshToken.findOne({
    token: hashedToken,
    user: decoded.id,
    expiresAt: { $gt: Date.now() },
  });
  if (!stored) {
    // 🔥 Token reuse detected → possible theft
    await RefreshToken.deleteMany({ user: decoded.id });
    return res.status(401).json({
      message: "Session compromised. Please log in again.",
    });
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    await RefreshToken.deleteMany({ user: user._id });
    return res.status(401).json({ message: "Please log in again" });
  }

  await RefreshToken.deleteOne({ _id: stored._id });

  const newRefreshToken = signRefreshToken(user._id);
  await RefreshToken.create({
    token: crypto.createHash("sha256").update(newRefreshToken).digest("hex"),
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const newAccessToken = signAccessToken(user._id);

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15min
    path: "/",
  };

  const cookieName = isProduction ? "__Host-token" : "token";
  res.cookie(cookieName, newAccessToken, options);

  res.cookie(refreshCookieName, newRefreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ status: "success" });
});

exports.getGoogleCallback = async (req, res) => {
  await createSendResponse(res, 200, req.user);

  const isProduction = process.env.NODE_ENV === "production";

  const redirect = req.cookies.auth_redirect;
  const redirectMap = {
    admin: process.env.ADMIN_URL,
    store: process.env.STORE_URL,
  };
  const redirectUrl = redirectMap[redirect] || process.env.STORE_URL;

  res.clearCookie("auth_redirect", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.redirect(redirectUrl);
};
