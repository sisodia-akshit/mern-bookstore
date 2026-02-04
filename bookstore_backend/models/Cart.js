const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                coverImage: {
                    type: String,
                    required: true,
                },
                lineTotal: {
                    type: Number,
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ["INR"],
            default:"INR"
        }

    },
    {
        timestamps: true,
        versionKey: false        //Carts should not use optimistic locking.
    }
);


module.exports = mongoose.model("Cart", cartSchema);