const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAdminStats } = require("../controllers/adminController");

// admin
router.get("/", protect, adminOnly, getAdminStats);

module.exports = router;
