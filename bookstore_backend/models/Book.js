const mongoose = require("mongoose");
const { maxLength, lowercase } = require("zod");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [1, "Book title must have at least 1 character."],
      maxlength: [100, "Book title must not have more than 100 characters."],
      lowercase: true,
      required: [true, "Title is required field!"],
      trim: true,
    },
    author: {
      type: String,
      minlength: [1, "Author name must have at least 1 character."],
      maxlength: [25, "Author name must not have more than 25 characters."],
      lowercase: true,
      required: [true, "Author is required field!"],
    },
    price: {
      type: Number,
      min: [1, "Price must be 1 or above"],
      max: [999999999999, "Price exceeds allowed limit"],
      required: [true, "price is required field!"],
    },
    coverImage: {
      type: String,
      required: [true, "coverImage is required field!"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
    },
    pages: {
      type: Number,
      min: [0, "Pages must be 0 or above."],
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: {
          type: String,
          maxLength: [50, "Title must not have more than 50 characters."],
        },
        comment: {
          type: String,
          maxlength: [250, "Comment must not have more than 250 characters."],
        },
        rating: {
          type: Number,
          required: [true, "Rating is required"],
          min: [1, "Rating must be 1 or above."],
          max: [5, "Rating must be 5 or below."],
        },
      },
    ],
    description: {
      type: String,
      maxLength: [2000, "Description must not have more than 2000 character."],
      trim: true,
    },
    language: {
      type: String,
      default: "English",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rentedCount: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "Academic",
        "Arts & Design",
        "Business & Finance",
        "Children & Young Adult",
        "Fiction",
        "Health & Lifestyle",
        "Non-Fiction",
        "Politics & Society",
        "Religion & Spirituality",
        "Technology",
        "Travel & Geography",
        "Other",
      ],
      required: true,
      default: "Other",
      message: "Invalid category selected",
    },
    genres: {
      type: [String],
      set: v => v.map(s => s.toLowerCase()),
      validate: {
        validator: (v) => v.length > 0 && v.length <= 5,
        message: "Genre must be between 1 and 5",
      },
      default: ["Other"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

bookSchema.virtual("isAvailable").get(function () {
  return this.stock > 0;
});
// to send this above virtual 
bookSchema.set("toJSON", { virtuals: true });
bookSchema.set("toObject", { virtuals: true });

bookSchema.pre(/^find/, function () {
  if (this.getOptions().skipDeleted) return;
  this.where({ isDeleted: { $ne: true } });
});

bookSchema.pre("countDocuments", function () {
  this.where({ isDeleted: { $ne: true } });
});

bookSchema.pre("findOneAndUpdate", function () {
  if (this.getOptions().skipDeleted) return;
  this.where({ isDeleted: { $ne: true } });
});

bookSchema.pre("aggregate", function () {
  const opts = this.options || {};
  if (opts.skipDeleted) return;

  this.pipeline().unshift({
    $match: { isDeleted: { $ne: true } },
  });
});

// indexes
bookSchema.index({ createdBy: 1 }); // Seller
//// bookSchema.index({ genres: 1, stock: 1, price: 1 });
bookSchema.index({ title: "text", genres: "text" }); //Search
bookSchema.index({ category: 1, genres: 1 }); // Filters / sorting
//// bookSchema.index({ ratings: 1 }); // Filters / sorting

module.exports = mongoose.model("Book", bookSchema);
