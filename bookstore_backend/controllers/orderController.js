const Order = require("../models/Order");
const Book = require("../models/Book");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ApiFeatures = require("../utils/ApiFeatures");

// PLACE ORDER
exports.placeOrder = asyncErrorHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  let totalAmount = 0;

  for (let item of items) {
    const book = await Book.findById(item._id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    totalAmount += book.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: items.map((item) => ({
      _id: item._id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      coverImage: item.coverImage,
    })),
    totalAmount,
  });

  res.status(201).json(order);
});

// USER ORDERS
exports.getMyOrders = asyncErrorHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id }).populate(
    "items._id",
    "title price"
  );
  res.status(200).json({
    status: "success",
    total: totalOrders,
    data: orders,
  });
});

// ADMIN: ALL ORDERS
exports.getAllOrders = asyncErrorHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments(
    req.query.status ? { status: req.query.status } : {}
  );
  const features = new ApiFeatures(
    Order.find().populate("user", "name email"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  res.status(200).json({
    status: "success",
    total: totalOrders,
    data: await features.query,
  });
});

// seller ORDERS
exports.getSellersOrders = asyncErrorHandler(async (req, res) => {
  const sellerId = req.user._id.toString();

  const data = await Order.aggregate([
    // Break items array into individual documents
    { $unwind: "$items" },

    // Join book info
    {
      $lookup: {
        from: "books",
        localField: "items._id",
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
            _id: "$book._id",
            title: "$book.title",
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

  res.status(200).json({
    status: "success",
    total: data.length,
    data,
  });
});
