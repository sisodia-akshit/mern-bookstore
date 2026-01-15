const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require("../models/User");
const ApiFeatures = require("../utils/ApiFeatures");

exports.getUsers = asyncErrorHandler(async (req, res) => {
  const totalUsers = await User.countDocuments(
    req.query.email ? { email: { $regex: req.query.email } } : {}
  );
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // sendResponce(res, 200, await features.query);
  res.status(200).json({
    status: "success",
    total: totalUsers,
    data: await features.query,
  });
});
