const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cloudinaryRoutes = require("./routes/cloudinary");


const app = express();
app.use(cors());
app.use(express.json());

// simple health route
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);


module.exports = app;
