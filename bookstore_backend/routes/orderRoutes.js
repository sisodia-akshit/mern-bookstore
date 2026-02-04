const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getSellersOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, restrictTo } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const { createOrderSchema, updateOrderStatusSchema } = require("../utils/validators/order.schema");

// user
router.get("/my", protect, getMyOrders);
router.post("/", protect, validate(createOrderSchema), placeOrder);

// seller
router.get("/", protect, getSellersOrders);
router.patch("/:orderId", protect, validate(updateOrderStatusSchema), updateOrderStatus);

// admin
router.get("/all", protect, restrictTo("admin", "operator"), getAllOrders);


module.exports = router;
