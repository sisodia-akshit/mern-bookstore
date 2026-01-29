const mongoose = require("mongoose");
const Order = require("../models/Order");
const Book = require("../models/Book");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ApiFeatures = require("../utils/ApiFeatures");
const CustomError = require("../utils/CustomError");
const OrderFeatures = require("../utils/OrderFeatures");

const sendResponse = ({ res, code,total, data, message }) => {
  res.status(code).json({
    status: "success",
    ...(total && { total: total }),
    ...(data && { data: data }),
    ...(message && { message: message }),
  });
};

// PLACE ORDER
exports.placeOrder = asyncErrorHandler(async (req, res) => {
  const { items } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const book = await Book.findOneAndUpdate(
        { _id: item.book, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity }, $set: { isAvailable: true } },
        { new: true, session },
      );

      if (!book) {
        throw new CustomError(`Book ${item.book} is out of stock`, 400);
      }

      if (book.stock === 0) {
        await Book.updateOne(
          { _id: book._id },
          { isAvailable: false },
          { session },
        );
      }

      totalAmount += book.price * item.quantity;

      orderItems.push({
        book: book._id,
        seller: book.createdBy,
        title: book.title,
        coverImage: book.coverImage,
        quantity: item.quantity,
        price: book.price,
      });
    }

    await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          totalAmount,
          status: "pending",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    sendResponse({ res, code: 201, message: "Order created successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// USER ORDERS
exports.getMyOrders = asyncErrorHandler(async (req, res) => {
  const baseQuery = Order.find({ user: req.user._id }).populate(
    "items.book",
    "title author coverImage",
  );

  const features = new OrderFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const total = await Order.countDocuments(features.query.getFilter());

  sendResponse({ res, code: 200, total, data: await features.query });
});

// ADMIN: ALL ORDERS
exports.getAllOrders = asyncErrorHandler(async (req, res) => {
  const baseQuery = Order.find()
    .populate("user", "name email")
    .populate("items.book", "title author coverImage");
  const features = new OrderFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const total = await Order.countDocuments(features.query.getFilter());

  sendResponse({ res, code: 200, total, data: await features.query });
});

// seller ORDERS
exports.getSellersOrders = asyncErrorHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await Order.aggregate([
    // Break items array into individual documents
    { $unwind: "$items" },

    // Join book info
    {
      $lookup: {
        from: "books",
        localField: "items.book",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },

    // Only books created by this seller
    {
      $match: {
        "book.createdBy": sellerId,
      },
    },

    //Join user (who ordered)
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "orderedBy",
      },
    },
    { $unwind: "$orderedBy" },
    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },

        user: {
          $first: {
            _id: "$orderedBy._id",
            name: "$orderedBy.name",
            email: "$orderedBy.email",
          },
        },

        items: {
          $push: {
            book: "$items.book",
            title: "$items.title",
            coverImage: "$items.coverImage",
            price: "$items.price",
            quantity: "$items.quantity",
          },
        },
        totalAmount: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"],
          },
        },
      },
    },
  ]);

  sendResponse({ res, code: 200, total: data.length, data });
});
