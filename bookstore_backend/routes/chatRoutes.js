const express = require("express");
const router = express.Router();


const { protect} = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const { globalChatSchema } = require("../utils/validators/chat.schema");
const { sendGlobalMessage , getGlobalChat } = require("../controllers/chatController");

// user
router.get("/global", protect, getGlobalChat);
router.post("/global", protect, sendGlobalMessage );

module.exports = router;
