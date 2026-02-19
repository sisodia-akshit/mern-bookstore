import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

privateMessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export const PrivateMessage = mongoose.model(
  "PrivateMessage",
  privateMessageSchema
);
