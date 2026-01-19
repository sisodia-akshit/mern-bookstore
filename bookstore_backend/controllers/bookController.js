const Book = require("../models/Book");
const ApiFeatures = require("../utils/ApiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const sendResponce = (res, code, data) => {
  res.status(code).json({
    status: "success",
    data,
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

  const createdBy = req.user._id;

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
    createdBy,
  });
  sendResponce(res, 201, book);
});

// READ all (public)
exports.getBooks = asyncErrorHandler(async (req, res) => {
  const totalBooks = await Book.countDocuments(
    req.query.createdBy ? { createdBy: req.query.createdBy } : {},
  );
  const features = new ApiFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // sendResponce(res, 200, await features.query);
  res.status(200).json({
    status: "success",
    totalBooks,
    data: await features.query,
  });
});

// READ my books (public)
exports.getMyBooks = asyncErrorHandler(async (req, res) => {
  const totalBooks = await Book.countDocuments({ createdBy: req.user._id });
  const features = new ApiFeatures(
    Book.find({ createdBy: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // sendResponce(res, 200, await features.query);
  res.status(200).json({
    status: "success",
    totalBooks,
    data: await features.query,
  });
});

// READ one (public)
exports.getBookById = asyncErrorHandler(async (req, res) => {
  const book = await Book.findById(req.params._id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  sendResponce(res, 200, book);
});

// UPDATE (admin)
exports.updateBook = asyncErrorHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
  });
  sendResponce(res, 200, book);
});

// UPDATE (my)
exports.updateMyBook = asyncErrorHandler(async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { createdBy: req.user._id, _id: req.params._id },
    req.body,
    {
      new: true,
    },
  );
  sendResponce(res, 200, book);
});

// DELETE (admin)
exports.deleteBook = asyncErrorHandler(async (req, res) => {
  await Book.findByIdAndDelete(req.params._id);
  sendResponce(res, 204, null);
});
