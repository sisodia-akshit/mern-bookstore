const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getSellersOrders,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// user
router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);

// admin
router.get("/all", protect, adminOnly, getAllOrders);
// seller
router.get("/", protect, getSellersOrders);

module.exports = router;
