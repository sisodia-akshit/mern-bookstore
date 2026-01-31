const express = require("express");
const passport = require("passport");
const validate = require("../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  otpSchema,
  verifyOtpSchema,
} = require("../utils/validators/auth.schema");

const router = express.Router();

const {
  login,
  logout,
  generateOtp,
  verifyOtp,
  register,
  getGoogleCallback,
  forgetPassword,
  resetPassword,
  refreshToken,
} = require("../controllers/authController");
const { authLimiter, otpLimiter, resetPasswordLimiter } = require("../middleware/rateLimiter");
const { protect } = require("../middleware/authMiddleware");


router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", authLimiter, refreshToken);
router.post("/forget-password", resetPasswordLimiter, validate(forgetPasswordSchema), forgetPassword);
router.post("/generate-otp", otpLimiter, validate(otpSchema), generateOtp);
router.post("/verify-otp", otpLimiter, validate(verifyOtpSchema), verifyOtp);
router.post(
  "/reset-password/:token",
  resetPasswordLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);

router.post("/logout", protect, logout);

// Redirect to Google
router.get(
  "/google",
  (req, res, next) => {
    const redirect = req.query.redirect;

    res.cookie("auth_redirect", redirect, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 60 * 1000, // 5 minutes
      path: "/",
    });

    next();
  }, //save temp-cookie 
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

//Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  getGoogleCallback,
);

module.exports = router;
