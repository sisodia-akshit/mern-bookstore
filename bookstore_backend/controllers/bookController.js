const Book = require("../models/Book");
const ApiFeatures = require("../utils/ApiFeatures");

// CREATE (admin)
exports.createBook = async (req, res) => {
  try {
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
    res.status(201).json({
      status: "success",
      book,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to create book" });
  }
};

// READ all (public)
exports.getBooks = async (req, res) => {
  try {
    const features = new ApiFeatures(Book.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const books = await features.query;

    // const books = await Book.find();
    res.status(200).json({
      status: "success",
      length: books.length,
      books,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// READ one (public)
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// UPDATE (admin)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};

// DELETE (admin)
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
};
