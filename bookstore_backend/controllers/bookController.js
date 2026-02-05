const mongoose = require("mongoose");
const Book = require("../models/Book");
const ApiFeatures = require("../utils/ApiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const Order = require("../models/Order");

const sendResponce = (res, code, data) => {
  res.status(code).json({
    status: "success",
    data,
  });
};

// CREATE
exports.createBook = asyncErrorHandler(async (req, res) => {
  const {
    title,
    author,
    price,
    stock,
    pages,
    description,
    category,
    genres,
    coverImage,
  } = req.body;

  const book = await Book.create({
    title,
    author,
    price,
    stock,
    pages,
    description,
    category,
    genres,
    coverImage,
    createdBy: req.user._id,
  });
  sendResponce(res, 201, book);
});

// READ all (public)
exports.getBooks = asyncErrorHandler(async (req, res) => {
  const baseQuery = Book.find();
  const features = new ApiFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const totalBooks = await Book.countDocuments(features.filterQuery);

  const data = await features.query;

  res.status(200).json({
    status: "success",
    totalBooks,
    data,
  });
});

// READ my books (public)
exports.getMyBooks = asyncErrorHandler(async (req, res) => {
  const baseQuery = Book.find({ createdBy: req.user.id });
  const features = new ApiFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let filters = features.filterQuery;
  filters.createdBy = req.user.id;
  const totalBooks = await Book.countDocuments(filters);

  const data = await features.query;

  res.status(200).json({
    status: "success",
    totalBooks,
    data,
  });
});

// READ one (public)
exports.getBookById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid book ID", 400);
  }

  const book = await Book.findById(id)
    .populate("reviews.user", "name email photo")
    .populate("createdBy", "name email photo");

  if (!book) {
    return next(new CustomError("Book not found!", 404));
  }

  let hasPurchased = false;
  if (req.user) {
    hasPurchased = !!(await Order.exists({
      user: req.user._id,
      "items.book": id,
      status: "paid",
    }));
  }

  res.status(200).json({
    status: "success",
    data: book,
    hasPurchased,
  });
});

// UPDATE (my)
exports.updateBook = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid book ID", 400);
  }

  const updateData = {};
  const allowedFields = [
    "title",
    "author",
    "genres",
    "price",
    "category",
    "description",
    "stock",
    "pages",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const book = await Book.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!book) {
    throw new CustomError("Book not found!", 404);
  }

  sendResponce(res, 200, book);
});

//review update
exports.addReview = asyncErrorHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid book ID", 400);
  }

  const book = await Book.findById(id);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }

  const alreadyReviewed = book.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );

  if (alreadyReviewed) {
    throw new CustomError("Can't review twice!!", 400);
  }

  book.reviews.push({
    user: req.user._id,
    rating,
    title,
    comment,
  });

  book.ratings =
    (book.ratings * book.ratingsCount + rating) / (book.ratingsCount + 1);

  book.ratingsCount += 1;

  await book.save();

  res.status(201).json({
    status: "success",
    message: "Review added",
  });
});

// DELETE
exports.deleteBook = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid book ID", 400);
  }

  const book = await Book.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    { isDeleted: true },
    { new: true },
  );

  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  res.status(204).end();
});

exports.getBookByCategory = asyncErrorHandler(async (req, res, next) => {
  const category = req.params.category;
  const books = await Book.aggregate([
    // { $unwind: "$category" },
    { $match: { category } },
    { $sort: { createdAt: -1 } }, // or price / rating
    { $limit: 12 },
    {
      $addFields: {
        isAvailable: { $gt: ["$stock", 0] },
      },
    },
    {
      $group: {
        _id: "$category",
        bookCount: { $sum: 1 },
        books: { $push: "$$ROOT" },
      },
    },
    { $addFields: { category: "$_id" } },
    { $project: { _id: 0 } },
  ]);

  res.status(200).json({
    status: "success",
    data: books[0].books,
    totalBooks: books[0].bookCount,
  });
});

// // admin //

// UPDATE (admin)
exports.adminUpdateBook = asyncErrorHandler(async (req, res) => {
  const updateData = {};
  const allowedFields = [
    "title",
    "author",
    "price",
    "stock",
    "description",
    "category",
    "genres",
    "pages",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid book ID", 400);
  }

  const book = await Book.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    throw new CustomError("Book not found!", 404);
  }
  sendResponce(res, 200, book);
});

// DELETE (admin)
exports.adminDeleteBook = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid book ID", 400);
  }

  const book = await Book.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  res.status(204).end();
});
