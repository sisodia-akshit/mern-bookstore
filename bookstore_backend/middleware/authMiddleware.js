const jwt = require("jsonwebtoken");
const User = require("../models/User");

// check if user is logged in
exports.protect = async (req, res, next) => {
  const token = process.env.NODE_ENV === "production" ? req.cookies["__Host-token"] : req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }
  if (req.user.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({ message: "Password was changed. Please log in again." });
  }

  next();
};


exports.isLogged = async (req, res, next) => {
  const token = process.env.NODE_ENV === "production" ? req.cookies["__Host-token"] : req.cookies.token;

  if (!token) {
    return next();
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next();
  }

  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user || req.user.changedPasswordAfter(decoded.iat)) {
    req.user = undefined;
  }

  next();
};

// check if user is admin
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};