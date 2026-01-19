const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getUsers, setUserRole } = require("../controllers/userController");

router.get("/", protect, getUsers);
router.patch("/change_role/:id", protect,adminOnly, setUserRole);


module.exports = router;
