const { z } = require("zod");

exports.registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
exports.forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});
exports.resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6),
  }),
});
exports.otpSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
});
exports.verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{4}$/, "OTP must be exactly 4 digits"),
  }),
});
