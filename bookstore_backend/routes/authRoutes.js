const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
  login,
  getMe,
  logout,
  generateOtp,
  verifyOtp,
  register,
  getGoogle,
  getGoogleCallback,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.post("/generate_otp", generateOtp);
router.post("/verify", verifyOtp);

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
