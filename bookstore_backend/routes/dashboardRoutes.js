const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

// admin
router.get("/", protect, getDashboardStats);

module.exports = router;
