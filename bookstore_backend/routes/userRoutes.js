const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getUsers,
  setUserRole,
  getMe,
  addAddress,
  setDefaultAddress,
} = require("../controllers/userController");
const validate = require("../middleware/validate.middleware");
const { addressSchema } = require("../utils/validators/user.validate");

router.get("/", protect, getUsers);
router.get("/me", protect, getMe);
router.post("/address", protect, validate(addressSchema), addAddress);
router.post("/address/:address", protect, setDefaultAddress);

// admin
router.patch("/change_role/:id", protect, restrictTo("admin"), setUserRole);

module.exports = router;
