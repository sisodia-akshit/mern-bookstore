const express = require("express");
const { getPrivateMessage, sendPrivateMessage } = require("../controllers/privateMessageController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:userId", protect, getPrivateMessage);
router.post("/", protect, sendPrivateMessage);
module.exports = router;