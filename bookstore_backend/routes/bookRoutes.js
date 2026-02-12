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
  isLogged,
  restrictTo,
} = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const {
  createBookSchema,
  updateBookSchema,
  addReviewSchema,
} = require("../utils/validators/book.schema");

router.get("/book-by-category/:category", getBookByCategory);

// public
router.get("/", getBooks);
router.get("/book/:id", isLogged, getBookById);
router.get("/my", protect, getMyBooks);

router.post("/", protect, validate(createBookSchema), createBook);
router.post("/book/:id/review", protect, validate(addReviewSchema), addReview);
router.patch("/mybook/:id", protect, validate(updateBookSchema), updateBook);
router.delete("/mybook/:id", protect, deleteBook);

// admin
router.patch(
  "/book/:id",
  protect,
  restrictTo("admin"),
  validate(updateBookSchema),
  adminUpdateBook,
);
router.delete("/book/:id", protect, restrictTo("admin"), adminDeleteBook);

module.exports = router;
