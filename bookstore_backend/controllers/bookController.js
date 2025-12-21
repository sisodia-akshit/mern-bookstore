const Book = require("../models/Book");
const ApiFeatures = require("../utils/ApiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const sendResponce = (res, code, data) => {
  res.status(code).json({
    status: "success",
    data
  });
};

// CREATE (admin)
exports.createBook = asyncErrorHandler(async (req, res) => {
  const {
    title,
    author,
    genres,
    price,
    description,
    isAvailable,
    pages,
    ratings,
    coverImage,
  } = req.body;

  const bookOwner = req.user.email;

  const book = await Book.create({
    title,
    author,
    genres,
    price,
    description,
    isAvailable,
    pages,
    ratings,
    coverImage,
    bookOwner,
  });
  sendResponce(res, 201, book);
});

// READ all (public)
exports.getBooks = asyncErrorHandler(async (req, res) => {
  const features = new ApiFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  sendResponce(res, 200, await features.query);
});

// READ one (public)
exports.getBookById = asyncErrorHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  sendResponce(res, 200, book);
});

// UPDATE (admin)
exports.updateBook = asyncErrorHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  sendResponce(res, 200, book);
});

// DELETE (admin)
exports.deleteBook = asyncErrorHandler(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  sendResponce(res, 204, null);
});
