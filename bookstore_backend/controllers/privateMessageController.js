const { getIO } = require("../config/socket");
const mongoose = require("mongoose");
const { PrivateMessage } = require("../models/PrivateMessage");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require("../models/User");

exports.sendPrivateMessage = asyncErrorHandler(async (req, res, next) => {
  const { receiver, content } = req.body;

  if (!receiver || !content) {
    throw new CustomError("Missing fields!", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    throw new CustomError("Invalid receiver ID", 400);
  }

  const isReceiver = await User.findById(receiver);
  if (!isReceiver) {
    throw new CustomError("User not found!", 404);
  }

  const message = await PrivateMessage.create({
    sender: req.user._id,
    receiver,
    content,
  });

  const populatedMessage = await message.populate("sender", "name email photo");

  // Emit only to receiver
  getIO().to(receiver.toString()).emit("private:newMessage", populatedMessage);

  res.status(201).json({
    success: true,
    message: populatedMessage,
  });
});

exports.getPrivateMessage = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  };

  const total = await PrivateMessage.countDocuments(query);

  const messages = await PrivateMessage.find(query)
    .populate("sender", "name email photo")
    .populate("receiver", "name email photo")
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});
