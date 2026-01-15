const Book = require("../models/Book");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getDashboardStats = asyncErrorHandler(async (req, res) => {
  const myTotalBooks = await Book.countDocuments({ createdBy: req.user._id });
  res.status(200).json({
    myTotalBooks,
  });
});
