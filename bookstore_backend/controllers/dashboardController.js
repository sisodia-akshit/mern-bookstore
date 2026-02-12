const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");

const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getDashboardStats = asyncErrorHandler(async (req, res) => {
  const sellerId = req.user._id.toString();
  const [myTotalBooks, orderStats] = await Promise.all([
    Book.countDocuments({ createdBy: req.user._id }),
    Order.aggregate([
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

      // Shape final response
      {
        $project: {
          orderStatus: "$orderStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",

          items: {
            _id: "$book._id",
            title: "$book.title",
            price: "$items.price",
            quantity: "$items.quantity",
          },

          user: {
            _id: "$orderedBy._id",
            name: "$orderedBy.name",
            email: "$orderedBy.email",
          },
        },
      },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const orders = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orderStats.forEach((stat) => {
    orders[stat._id] = stat.count;
  });
  console.log(orderStats, orders);

  res.status(200).json({
    totalBooks: myTotalBooks,
    totalOrders: orderStats.length,
    orders,
  });
});

exports.getAdminDashboardStats = asyncErrorHandler(async (req, res) => {
  const [totalBooks, myTotalBooks, totalUsers, totalOrders, orderStats] =
    await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ createdBy: req.user._id }),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  const orders = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orderStats.forEach((stat) => {
    orders[stat._id] = stat.count;
  });

  res.json({
    totalBooks,
    myTotalBooks,
    totalUsers,
    totalOrders,
    orders,
  });
});
