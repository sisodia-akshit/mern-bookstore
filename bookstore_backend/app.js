const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet"); //more security
const hpp = require("hpp");        //prevent parameter 
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cloudinaryRoutes = require("./routes/cloudinary");

const app = express();
app.use(cors());

app.use(helmet());

let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests with this IP. Please try after one hour.",
});

app.use("/api", limiter);
app.use(express.json());

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
  })
);
// app.use(morgan("dev"));

// simple health route
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

module.exports = app;
