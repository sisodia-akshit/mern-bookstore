const { getIO } = require("../config/socket");
const { GlobalChat  } = require("../models/GlobalChat ");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.sendGlobalMessage = asyncErrorHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  // 1 Save message
  const chat = await GlobalChat .create({
    user: req.user._id, // from auth middleware
    message,
  });

  // 2️⃣ Populate user (important for frontend)
  const populatedChat = await chat.populate(
    "user",
    "name email photo"
  );

  // 3️⃣ 🔥 Emit to all connected clients
  getIO().emit("newMessage", populatedChat);

  // 4️⃣ Respond to sender
  res.status(201).json({
    success: true,
    chat: populatedChat,
  });
});

exports.getGlobalChat = asyncErrorHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await GlobalChat .find()
    .populate("user", "name email photo")
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});
