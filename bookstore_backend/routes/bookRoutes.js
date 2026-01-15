const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// public
router.get("/", getBooks);
router.get("/:_id", getBookById);

// admin
router.post("/", protect, createBook);
router.put("/:_id", protect, adminOnly, updateBook);
router.patch("/:_id", protect, adminOnly, updateBook);
router.delete("/:_id", protect, adminOnly, deleteBook);

module.exports = router;
