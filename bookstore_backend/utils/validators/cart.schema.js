const { z } = require("zod");

const addToCartSchema = z.object({
    body: z.object({
        book: z.string().min(1, "Book ID is required"),
        quantity: z.number().int().positive(),
    }),
});

// const getCartSchema = z.object({
//     query: z.object({
//         page: z.number().int().positive(),
//         limit: z.number().int().positive(),
//     }),
// });


const updateCartSchema = z.object({
    body: z.object({
        book: z.string().min(1, "Book ID is required"),
        quantity: z.number().int().positive(),
    }),
});

module.exports = { addToCartSchema, updateCartSchema };
