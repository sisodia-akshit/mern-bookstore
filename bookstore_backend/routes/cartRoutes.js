const express = require("express");
const router = express.Router();


const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const { addToCartSchema } = require("../utils/validators/cart.schema");
const { updateCartSchema } = require("../utils/validators/cart.schema");
const { addToCart, checkoutPreview } = require("../controllers/cartController");
const { getCart } = require("../controllers/cartController");
const { clearCart } = require("../controllers/cartController");
const { removeFromCart } = require("../controllers/cartController");
const { updateCart } = require("../controllers/cartController");

// user
router.get("/", protect, getCart);
router.post("/", protect, validate(addToCartSchema), addToCart);
router.put("/:book", protect, validate(updateCartSchema), updateCart);
router.delete("/:book", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.get("/checkout", protect, checkoutPreview);

module.exports = router;
