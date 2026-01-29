const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks,
  adminUpdateBook,
  adminDeleteBook,
  addReview,
  getBookByCategory,
} = require("../controllers/bookController");

const {
  protect,
  adminOnly,
  isLogged,
} = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const {
  createBookSchema,
  updateBookSchema,
  addReviewSchema,
} = require("../utils/validators/book.schema");

router.get("/book-by-category/:category",getBookByCategory)

// public
router.post("/", protect, validate(createBookSchema), createBook);
router.get("/", getBooks);
router.get("/book/:id", isLogged, getBookById);
router.post("/book/:id/review", protect, validate(addReviewSchema), addReview);
router.get("/my", protect, getMyBooks);
router.patch("/mybook/:id", protect, validate(updateBookSchema), updateBook);
router.delete("/mybook/:id", protect, deleteBook);

// admin
router.patch(
  "/book/:id",
  protect,
  adminOnly,
  validate(updateBookSchema),
  adminUpdateBook,
);

router.delete("/book/:id", protect, adminOnly, adminDeleteBook);

module.exports = router;
