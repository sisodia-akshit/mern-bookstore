let io;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(","),
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"],
  });

  //   Add authentication middleware HERE
  const cookie = require("cookie");
  const jwt = require("jsonwebtoken");
  const User = require("../models/User");

  io.use(async (socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        return next(new Error("Not authenticated"));
      }

      const parsed = cookie.parse(rawCookie);

      const token =
        process.env.NODE_ENV === "production"
          ? parsed["__Host-token"]
          : parsed.token;

      if (!token) {
        return next(new Error("No token found"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      if (user.changedPasswordAfter(decoded.iat)) {
        return next(new Error("Password changed. Re-login required."));
      }

      socket.user = user; // attach full user
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  // connection handler
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.user._id.toString();
    if (userId) {
      socket.join(userId); // 👈 critical
    }
    console.log(`User ${userId} connected`);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
