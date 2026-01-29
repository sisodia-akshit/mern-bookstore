const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getSellersOrders,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const { createOrderSchema } = require("../utils/validators/order.schema");

// user
router.post("/", protect, validate(createOrderSchema), placeOrder);
router.get("/my", protect, getMyOrders);

// admin
router.get("/all", protect, adminOnly, getAllOrders);
// seller
router.get("/", protect, getSellersOrders);

module.exports = router;
