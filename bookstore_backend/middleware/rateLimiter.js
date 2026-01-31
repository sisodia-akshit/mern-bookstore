const rateLimit = require("express-rate-limit");

// General API rate limiter (e.g. 100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for auth routes (login, register, OTP, etc.)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 5 attempts per window
    message: { success: false, message: "Too many attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for auth routes (login, register, OTP, etc.)
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { success: false, message: "Too many attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 24 * 60 * 60 * 1000, // 30d
    max: 1, // 1 attempts per window
    message: { success: false, message: "Too many attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, otpLimiter, resetPasswordLimiter };