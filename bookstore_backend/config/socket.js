let io;

const initSocket = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: process.env.CORS_ORIGINS?.split(","),
            methods: ["GET", "POST"],
        },
        transports: ["websocket"],
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

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