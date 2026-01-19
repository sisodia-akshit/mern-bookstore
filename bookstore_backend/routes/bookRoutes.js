const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks,
  updateMyBook,
} = require("../controllers/bookController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// public
router.get("/", getBooks);
router.get("/my", protect, getMyBooks);
router.get("/book/:_id", getBookById);
router.patch("/mybook/:_id", protect, updateMyBook);

// admin
router.post("/", protect, createBook);
router.patch("/book/:_id", protect, adminOnly, updateBook);
router.patch("/book/:_id", protect, adminOnly, updateBook);
router.delete("/book/:_id", protect, adminOnly, deleteBook);

module.exports = router;
