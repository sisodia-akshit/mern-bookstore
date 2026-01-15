const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getDashboardStats = asyncErrorHandler(async (req, res) => {
  // const books = await Book.find({createdBy:req.user._id})
  const myTotalBooks = await Book.countDocuments({ createdBy: req.user._id });
  res.status(200).json({
    myTotalBooks,
  });
});
