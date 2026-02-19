const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require("../models/User");
const ApiFeatures = require("../utils/ApiFeatures");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");
const UserFeatures = require("../utils/UserFeatures");

exports.getUsers = asyncErrorHandler(async (req, res, next) => {
  const search = req.query.search;

  // -------------------------
  // Find by ID
  // -------------------------
  if (search && mongoose.Types.ObjectId.isValid(search)) {
    const isUser = await User.findById(search).select("-password");

    if (!isUser) {
      return next(new CustomError("User not found!", 404));
    }

    return res.status(200).json({
      status: "success",
      total: 1,
      data: [isUser],
    });
  }

  // -------------------------
  // Search by name OR email
  // -------------------------

  const queryObj = {};

  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Optional: exclude current user
  if (req.user) {
    queryObj._id = { $ne: req.user._id };
  }

  const totalUsers = await User.countDocuments(queryObj);

  const features = new UserFeatures(
    User.find(queryObj),
    req.query
  )
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    total: totalUsers,
    data: users,
  });
});


exports.setUserRole = asyncErrorHandler(async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (role === "admin") {
    return res.status(400).json({ message: "Invalid role" });
  }

  const userId = req.params.id;

  await User.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
    },
  );
  res.status(200).json({
    status: "success",
    message: "Role changed successfully",
  });
});



exports.getMe = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

exports.addAddress = asyncErrorHandler(async (req, res, next) => {
  const { name, phone, line1, line2, country, state, pincode, city } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new CustomError("User not found!", 404));
  }

  const isFirstAddress = user.addresses.length === 0;

  user.addresses.push({
    name,
    phone,
    line1,
    line2,
    city,
    state,
    pincode,
    country: country || "India",
    isDefault: isFirstAddress,
  });

  await user.save();

  const defaultAddress = user.addresses.find((a) => a.isDefault);

  res.status(201).json({
    status: "success",
    message: "Address added successfully",
    data: {
      addresses: user.addresses,
      defaultAddress,
    },
  });
});

exports.setDefaultAddress = asyncErrorHandler(async (req, res, next) => {
  const { address } = req.params;

  if (!mongoose.Types.ObjectId.isValid(address)) {
    return next(new CustomError("Invalid address ID!", 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new CustomError("User not found!", 404));
  }

  const addressExists = user.addresses.find(
    (a) => a._id.toString() === address,
  );

  if (!addressExists) {
    return next(new CustomError("Address not found!", 404));
  }

  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === address;
  });

  await user.save();

  const defaultAddress = user.addresses.find((a) => a.isDefault);

  res.status(200).json({
    status: "success",
    message: "Default address set successfully",
    data: {
      addresses: user.addresses,
      defaultAddress,
    },
  });
});
