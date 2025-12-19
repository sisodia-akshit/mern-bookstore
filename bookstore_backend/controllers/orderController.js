const Order = require("../models/Order");
const Book = require("../models/Book");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    console.log(items);
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalAmount = 0;

    for (let item of items) {
      const book = await Book.findById(item._id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      totalAmount += book.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: items.map((item) => ({
        _id:item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        coverImage: item.coverImage,
      })),
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order failed" });
  }
};

// USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items._id",
      "title price"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ADMIN: ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.book", "title price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
