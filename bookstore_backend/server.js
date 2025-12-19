require("dotenv").config();
const connectDB = require("./config/db");

const app = require("./app.js");

// connect to mongoose
connectDB();

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
