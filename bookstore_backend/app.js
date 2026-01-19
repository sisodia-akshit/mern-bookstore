const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet"); //more security
const hpp = require("hpp"); //prevent parameter
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cloudinaryRoutes = require("./routes/cloudinary");
const contactRoutes = require("./routes/contactRoutes");
const cookieParser = require("cookie-parser");

//google
const passport = require("passport");
require("./config/passport");

const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://admin-dashboard-by-akshit.netlify.app",
            "https://bookstore-akshit.netlify.app",
          ]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(helmet());

let limiter = rateLimit({
  max: 200,
  windowMs: 15 * 60 * 1000,
  message:
    "We have received too many requests with this IP. Please try after one hour.",
});
app.set("trust proxy", 1);

app.use("/api", limiter);
app.use(express.json());
app.use(cookieParser());

app.use(
  hpp({
    whitelist: [
      "genre",
      "ratings",
      "price",
      "pages",
      "language",
      "publisher",
      "author",
      "bookOwner",
    ],
  }),
);
// app.use(morgan("dev"));

app.use(passport.initialize());

// simple health route
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
