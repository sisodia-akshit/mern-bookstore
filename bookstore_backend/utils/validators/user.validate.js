const { z } = require("zod");

exports.addressSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(3, "Name must have at least 3 characters")
            .max(30, "Name is too long"),

        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

        line1: z
            .string()
            .min(5, "Address line too short")
            .max(50),

        line2: z
            .string()
            .max(50)
            .optional(),

        city: z.string().min(2).max(30),

        state: z.string().min(2).max(30),

        pincode: z
            .string()
            .regex(/^\d{6}$/, "Invalid pincode"),

        country: z
            .enum(["India"])
            .optional()
            .default("India"),
    }),
});
