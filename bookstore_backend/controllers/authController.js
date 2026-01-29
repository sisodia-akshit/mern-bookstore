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

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

const createSendResponse = (res, code, user) => {
  const token = signToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  };

  res.cookie("token", token, options);

  res.status(code).json({
    status: "success",
  });
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

    createSendResponse(res, 201, user);
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

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 401);
  }

  if (user.provider !== "local") {
    throw new CustomError("Use Google login", 400);
  }
  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) {
    throw new CustomError("Invalid email or password", 401);
  }

  createSendResponse(res, 200, user);
});

exports.forgetPassword = async (req, res) => {
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
    user.save({ validateBeforeSave: false });
    throw new CustomError("Error sending email. Please try again later.", 500);
  }
};

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
  await user.save();
  createSendResponse(res, 200, user);
});

exports.logout = asyncErrorHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.json({ message: "Logged out" });
});

exports.generateOtp = asyncErrorHandler(async (req, res) => {
  const { name, email } = req.body;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new CustomError("Email Id already exist.", 400);
  }
  const record = await OTP.findOne({ email });
  if (record && record.createdAt > Date.now() - 2 * 60 * 1000) {
    throw new CustomError("Please wait before requesting again.", 429);
  }

  // create OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.findOneAndUpdate(
    { email },
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
      email,
      subject: "Email Verification Code",
      html,
    });

    res.status(200).json({
      status: "success",
      signupForm: {
        name,
        email,
      },
      otpSentTo: email,
    });
  } catch (error) {
    throw new CustomError("Error sending email. Please try again later.", 500);
  }
});

exports.verifyOtp = asyncErrorHandler(async (req, res) => {
  const { otp, email } = req.body;

  const record = await OTP.findOne({
    email: email.toLowerCase(),
    expiresAt: { $gt: Date.now() },
  });

  if (!record) {
    throw new CustomError("OTP expired or Authentication timeout!", 400);
  }

  if (record.attempts >= 5) {
    await OTP.deleteOne({ email });
    throw new CustomError("Too many attempts. Request new OTP.", 429);
  }

  if (!record.isOtpValid(otp)) {
    await OTP.updateOne({ email }, { $inc: { attempts: 1 } });
    throw new CustomError("Invalid OTP", 400);
  }

  await OTP.deleteOne({ email });

  await VerifiedEmail.findOneAndUpdate({ email }, {}, { upsert: true });

  res.status(200).json({
    message: "Email verified successfully.",
  });
});

exports.getGoogle = (req, res, next) => {
  const redirect = req.query.redirect;

  res.cookie("auth_redirect", redirect, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 5 * 60 * 1000, // 5 minutes
  });

  next();
};

exports.getGoogleCallback = (req, res) => {
  const token = signToken(req.user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  const redirect = req.cookies.auth_redirect;

  res.clearCookie("auth_redirect");

  if (redirect === "admin") {
    return res.redirect(process.env.ADMIN_URL);
  }

  return res.redirect(process.env.STORE_URL);
};
