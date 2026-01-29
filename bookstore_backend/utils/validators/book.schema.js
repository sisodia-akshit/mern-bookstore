const { z } = require("zod");
const { CATEGORY_GENRES } = require("../../config/genres");

const ALL_GENRES = Object.values(CATEGORY_GENRES).flat();

exports.createBookSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(150, "Title is too long"),

    author: z
      .string()
      .min(2, "Author name must be at least 2 characters")
      .max(100),

    price: z.coerce.number().positive("Price must be greater than 0"),

    stock: z.coerce.number().int().min(0),

    category: z.enum(
      [
        "Academic",
        "Arts & Design",
        "Business & Finance",
        "Children & Young Adult",
        "Fiction",
        "Health & Lifestyle",
        "Non-Fiction",
        "Politics & Society",
        "Religion & Spirituality",
        "Technology",
        "Travel & Geography",
      ],
      {
        message: "Invalid category selected",
      },
    ),

    genres: z
      .array(z.string())
      .min(1, "At least one genre is required")
      .max(5, "Maximum 5 genres are allowed")
      .refine((genres) => genres.every((genre) => ALL_GENRES.includes(genre)), {
        message: "Invalid genre selected",
      }),

    coverImage: z.string().url("Cover image must be a valid URL"),
  }),
});
exports.updateBookSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(150, "Title is too long"),

    author: z
      .string()
      .min(2, "Author name must be at least 2 characters")
      .max(100),

    price: z.coerce.number().positive("Price must be greater than 0"),

    stock: z.coerce.number().int().min(0),

    category: z.enum(
      [
        "Academic",
        "Arts & Design",
        "Business & Finance",
        "Children & Young Adult",
        "Fiction",
        "Health & Lifestyle",
        "Non-Fiction",
        "Politics & Society",
        "Religion & Spirituality",
        "Technology",
        "Travel & Geography",
      ],
      {
        message: "Invalid category selected",
      },
    ),

    genres: z
      .array(z.string())
      .min(1, "At least one genre is required")
      .max(5, "Maximum 5 genres are allowed")
      .refine((genres) => genres.every((genre) => ALL_GENRES.includes(genre)), {
        message: "Invalid genre selected",
      }),
  }),
});
exports.addReviewSchema = z.object({
  body: z.object({
    rating: z.coerce
      .number({ invalid_type_error: "Rating must be a number" })
      .int()
      .min(1)
      .max(5),

    title: z
      .string()
      .trim()
      .max(50, "Title must not have more than 250 characters."),

    comment: z
      .string()
      .trim()
      .max(250, "Comment must not have more than 250 characters."),
  }),
});
