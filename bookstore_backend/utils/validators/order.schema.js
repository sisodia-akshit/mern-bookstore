const { z } = require("zod");

const orderItemSchema = z.object({
  book: z.string().min(1, "Book ID is required"),
  quantity: z.coerce.number().int().positive(),
});

const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(orderItemSchema)
      .min(1, "Order must contain at least one item"),
  }),
});

module.exports = { createOrderSchema };