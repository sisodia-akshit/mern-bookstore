const express = require("express");
const router = express.Router();

const {
  protect,
  restrictTo,
} = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAdminDashboardStats,
} = require("../controllers/dashboardController");

// admin
router.get("/admin", protect, restrictTo("admin"), getAdminDashboardStats);

// all
router.get("/", protect, getDashboardStats);

module.exports = router;
