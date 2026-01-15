const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required field!"],
      minlength: [1, "Book title must have at least 1 character."],
      maxlength: [100, "Book title must not have more than 50 characters."],
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required field!"],
      minlength: [1, "Author name must have at least 1 character."],
      maxlength: [25, "Author name must not have more than 25 characters."],
    },
    genres: {
      type: [String],
      required: [true, "Genres is required field!"],
      lowercase: true,
      message: "Genres is a required field!",
    },
    pages: {
      type: Number,
      required: [true, "pages  is required field!"],
      min: [1, "pages must be at least 1"],
    },
    ratings: {
      type: Number,
      min: [1, "Ratings must be 1.0 or above."],
      max: [5, "Ratings must be 5.0 or below."],
    },
    reviews: {
      type: [String],
      minlength: [1, "Reviews must have at least 1 character."],
      maxlength: [250, "Reviews must not have more than 250 character."],
    },
    description: {
      type: String,
      required: [true, "Description is required field!"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "price is required field!"],
    },
    coverImage: {
      type: String,
      required: [true, "coverImage is required field!"],
    },
    language: {
      type: String,
      default: "English",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    createdBy: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rentedCount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", userSchema);
