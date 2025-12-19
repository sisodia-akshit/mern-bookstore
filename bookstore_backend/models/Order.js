const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        title:{
          type:String,
          required:true
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number, // price at time of order
          required: true,
        },
        coverImage: {
          type:String,
          required:true
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
