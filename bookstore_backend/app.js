const express = require("express");
const cors = require("cors");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet"); //more security
const hpp = require("hpp"); //prevent parameter
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cloudinaryRoutes = require("./routes/cloudinary");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const cookieParser = require("cookie-parser");

//google
const passport = require("passport");
require("./config/passport");

const app = express();

const corsOptions = require("./config/cors");
app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.set("trust proxy", 1);

let limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests. Please try again after 15 minutes.",
});

// app.use("/api/orders", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(
  hpp({
    whitelist: [
      "genre",
      "ratings",
      "price",
      "pages",
      "language",
      "author",
    ],
  }),
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(passport.initialize());

// simple health route
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);

app.all("/{*any}", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;  
