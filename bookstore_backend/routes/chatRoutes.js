const express = require("express");
const router = express.Router();


const { protect} = require("../middleware/authMiddleware");
const { sendGlobalMessage , getGlobalChat } = require("../controllers/chatController");

// user
router.get("/global", protect, getGlobalChat);
router.post("/global", protect, sendGlobalMessage );

module.exports = router;
