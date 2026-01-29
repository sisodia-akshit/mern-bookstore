const { Chat } = require("../models/Chat");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.sendGlobalMessage  = asyncErrorHandler(async (req, res) => {
    const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const chat = await Chat.create({
    user: req.user._id, // from auth middleware
    message,
  });

  res.status(201).json({
    success: true,
    chat,
  });
});

exports.getGlobalChat = asyncErrorHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await Chat.find()
    .populate("user", "name email photo")
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);
    console.log(messages)

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});
