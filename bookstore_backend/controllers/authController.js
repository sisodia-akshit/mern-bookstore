const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/email");

// REGISTER
exports.register = asyncErrorHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({ message: "Email Id already exist." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  await OTP.deleteOne({ email });

  res.status(201).json({
    message: "You have registered successfully.",
  });
});

// LOGIN
exports.login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (user.provider !== "local") {
    return res.status(400).json({ message: "Use Google login" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.getMe = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({ user });
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

  if (!name || !email) {
    return res.status(400).json({ message: "All fields required" });
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({ message: "Email Id already exist." });
  }

  const signupForm = {
    name,
    email,
  };

  // create OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  await OTP.create({
    email,
    otp,
  });

  //send otp to users email
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
      subject: "Email Varification Code",
      html,
    });

    res.status(200).json({
      status: "success",
      signupForm,
      otpSentTo: email,
    });
  } catch (error) {
    return new Error(error);
  }
});

exports.verifyOtp = asyncErrorHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "OTP required" });
  }

  const record = await OTP.findOne({ email, otp });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.status(200).json({
    message: "You have Verified successfully.",
  });
});
