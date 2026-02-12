const mongoose = require("mongoose");
const Order = require("../models/Order");
const Book = require("../models/Book");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ApiFeatures = require("../utils/ApiFeatures");
const CustomError = require("../utils/CustomError");
const OrderFeatures = require("../utils/OrderFeatures");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Counter = require("../models/Counter");

const sendResponse = ({ res, code, total, data, message }) => {
  res.status(code).json({
    status: "success",
    ...(total && { total: total }),
    ...(data && { data: data }),
    ...(message && { message: message }),
  });
};

exports.placeOrder = asyncErrorHandler(async (req, res, next) => {
  const { addressId, paymentMethod } = req.body;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    return next(new CustomError("Invalid address ID", 400));
  }

  if (!["COD", "UPI", "CARD"].includes(paymentMethod)) {
    throw new CustomError("Invalid payment method", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch user with address
    const user = await User.findById(req.user._id).session(session);
    if (!user) throw new CustomError("User not found", 404);

    const address = user.addresses.find((a) => a._id.toString() === addressId);
    if (!address) throw new CustomError("Address not found", 404);

    // 2. Fetch cart
    const cart = await Cart.findOne({ user: req.user._id }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new CustomError("Cart is empty", 400);
    }

    let subtotal = 0;
    const orderItems = [];

    // 3. Process each cart item
    for (const item of cart.items) {
      const book = await Book.findOneAndUpdate(
        { _id: item.book, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session },
      );

      if (!book) {
        throw new CustomError("One or more books are out of stock", 400);
      }
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        book: book._id,
        seller: book.createdBy,
        title: book.title,
        quantity: item.quantity,
        price: item.price,
        lineTotal,
        coverImage: item.coverImage,
      });
    }

    // 4. Charges (simple for now)
    const tax = Math.round(subtotal * 0.05);
    const shippingFee = subtotal > 500 ? 0 : 50;
    const discount = 0;
    const totalAmount = subtotal + tax + shippingFee - discount;

    // 5. generate order number
    const counter = await Counter.findOneAndUpdate(
      { name: "order" },
      { $inc: { value: 1 } },
      { new: true, upsert: true, session },
    );
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(counter.value).padStart(6, "0")}`;

    // 6. Create order
    const order = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          subtotal,
          tax,
          discount,
          shippingFee,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
          orderStatus: "pending",
          orderNumber,
          shippingAddress: {
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
          },
        },
      ],
      { session },
    );

    // 7. Clear cart
    await Cart.updateOne(
      { user: req.user._id },
      { $set: { items: [], totalAmount: 0 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
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
exports.getOrderById = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new CustomError("Invalid order ID", 400));
  }
  const order = await Order.findById(orderId).populate(
    "items.book",
    "title author coverImage",
  );
  if (!order) {
    return next(new CustomError("Order not found", 404));
  }
  // if (req.user._id !== order.user) {
  //   return next(new CustomError("Order not found!!!", 404));
  // }
  res.status(200).json({
    status: "success",
    data: order,
  });
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
        paymentMethod:{$first:"$paymentMethod"},
        orderNumber:{$first:"$orderNumber"},
        orderStatus:{$first:"$orderStatus"},

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

exports.updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new CustomError("Invalid order ID", 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  const role = req.user.role; // "user" | "seller" | "admin"
  const currentStatus = order.orderStatus;

  const allowedByRole = {
    user: ["cancelled"],
    seller: ["shipped"],
    admin: ["confirmed", "shipped", "delivered", "cancelled"],
  };

  if (!allowedByRole[role]?.includes(status)) {
    return next(new CustomError("You are not allowed to set this status", 403));
  }

  /* 2️⃣ State-based valid transitions */
  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!validTransitions[currentStatus].includes(status)) {
    return next(
      new CustomError(
        `Cannot change order from ${currentStatus} to ${status}`,
        400,
      ),
    );
  }

  /* 3️⃣ Seller ownership check (important) */
  if (role === "seller") {
    const sellerOwnsItem = order.items.some(
      (item) => item.seller.toString() === req.user._id.toString(),
    );

    if (!sellerOwnsItem) {
      return next(new CustomError("You can only update your own orders", 403));
    }
  }

  /* 4️⃣ Update status */
  order.orderStatus = status;

  // optional: auto update paymentStatus
  if (status === "cancelled") {
    order.paymentStatus = "cancelled";
  }

  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: {
      orderId: order._id,
      orderStatus: order.orderStatus,
    },
  });
});

// ADMIN: ALL ORDERS
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
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
