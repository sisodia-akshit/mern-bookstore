const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require("../models/User");
const ApiFeatures = require("../utils/ApiFeatures");

exports.getUsers = asyncErrorHandler(async (req, res) => {
  const totalUsers = await User.countDocuments(
    req.query.email ? { email: { $regex: req.query.email } } : {},
  );
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  res.status(200).json({
    status: "success",
    total: totalUsers,
    data: await features.query,
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
