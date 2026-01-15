const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getAdminStats = asyncErrorHandler(async (req, res) => {
  
  const [totalBooks, myTotalBooks, totalUsers, totalOrders, orderStats] =
    await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ createdBy: req.user._id }),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  const orders = {
    pending: 0,
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
