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
  getGoogle,
  getGoogleCallback,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");


router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forget-password", validate(forgetPasswordSchema), forgetPassword);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword,
);
router.get("/logout", logout);

router.post("/generate_otp", validate(otpSchema), generateOtp);
router.post("/verify", validate(verifyOtpSchema), verifyOtp);

// Redirect to Google
router.get(
  "/google",
  getGoogle,
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
