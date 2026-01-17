const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAdminDashboardStats,
} = require("../controllers/dashboardController");

// admin
router.get("/admin", protect, adminOnly, getAdminDashboardStats);

// all
router.get("/", protect, getDashboardStats);

module.exports = router;
