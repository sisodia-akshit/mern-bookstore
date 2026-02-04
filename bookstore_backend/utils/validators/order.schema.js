const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    addressId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "Invalid address ID"),

    paymentMethod: z.enum(["COD", "UPI", "CARD"])
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ])
  })
})

module.exports = { createOrderSchema, updateOrderStatusSchema };