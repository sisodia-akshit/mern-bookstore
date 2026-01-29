const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getUsers, setUserRole, getMe } = require("../controllers/userController");

router.get("/", protect, getUsers);
router.get("/me", protect, getMe);

router.patch("/change_role/:id", protect, adminOnly, setUserRole);

module.exports = router;
