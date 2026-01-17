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
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

//Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.redirect(process.env.FRONTEND_URL);
  },
);

module.exports = router;
