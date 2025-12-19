const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// user
router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);

// admin
router.get("/", protect, adminOnly, getAllOrders);

module.exports = router;
