const mongoose = require("mongoose");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

exports.addToCart = asyncErrorHandler(async (req, res, next) => {
    const { book, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(book)) {
        return next(new CustomError("Invalid book ID!", 400));
    }

    const bookData = await Book.findById(book).select("title author price coverImage");
    if (!bookData) {
        return next(new CustomError("Book not found!", 404));
    }

    // Ensure cart exists (atomic)
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [],
            totalAmount: 0,
        });
    }

    const itemExists = cart.items.find(
        item => item.book.toString() === book
    );

    let items;

    if (itemExists) {
        items = cart.items.map(item =>
            item.book.toString() === book
                ? {
                    ...item.toObject(),
                    quantity: item.quantity + quantity,
                    lineTotal: item.price * (item.quantity + quantity),
                }
                : item.toObject()
        );
    } else {
        items = [
            ...cart.items.map(i => i.toObject()),
            {
                book: bookData._id,
                quantity,
                price: bookData.price,
                coverImage: bookData.coverImage,
                lineTotal: bookData.price * quantity,
            },
        ];
    }

    const totalAmount = items.reduce(
        (acc, item) => acc + item.lineTotal,
        0
    );

    await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items, totalAmount },
        { new: true }
    );

    res.status(201).json({
        status: "success",
        message: "Item added to cart successfully",
    });
});

exports.getCart = asyncErrorHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id })
        .populate("items.book", "title author stock");

    if (!cart) {
        cart = {
            items: [],
            totalAmount: 0,
        };
    }
    res.status(200).json({
        status: "success",
        data: cart,
    });
});

exports.clearCart = asyncErrorHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) {
        return next(new CustomError("No cart found!", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Cart cleared successfully",
    });
});

exports.removeFromCart = asyncErrorHandler(async (req, res, next) => {
    const { book } = req.params;
    if (!mongoose.Types.ObjectId.isValid(book)) {
        return next(new CustomError("Invalid book ID!", 400));
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new CustomError("No cart found!", 404));
    }
    const isItemExists = cart.items.some((item) => item.book.toString() === book.toString());
    if (!isItemExists) {
        return next(new CustomError("Item not found in cart!", 404));
    }

    cart.items = cart.items.filter((item) => item.book.toString() !== book.toString());
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();
    res.status(200).json({
        status: "success",
        message: "Item removed from cart successfully",
    });
});

exports.updateCart = asyncErrorHandler(async (req, res, next) => {
    const { book, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(book)) {
        return next(new CustomError("Invalid book ID!", 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(200).json({
            status: "success",
            data: { items: [], totalAmount: 0 },
        });
    }

    const items = cart.items.map(item =>
        item.book.toString() === book
            ? { ...item.toObject(), quantity, lineTotal: item.price * quantity }
            : item.toObject()
    );

    const totalAmount = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items, totalAmount },
        { new: true }
    );

    res.status(200).json({
        status: "success",
        data: updatedCart,
    });
});

exports.checkoutPreview = asyncErrorHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
        return res.status(200).json({
            status: "success",
            data: {
                items: [],
                subTotal: 0,
                discount: 0,
                tax: 0,
                shippingFee: 0,
                totalAmount: 0,
                currency: "INR",
            },
        });
    }

    const subTotal = cart.items.reduce(
        (acc, item) => acc + item.lineTotal,
        0
    );

    const discount = 0;        // later: coupons
    const tax = Math.round(subTotal * 0.05); // example 5%
    const shippingFee = subTotal > 500 ? 0 : 50;

    const totalAmount = subTotal - discount + tax + shippingFee;

    res.status(200).json({
        status: "success",
        data: {
            items: cart.items,
            subTotal,
            discount,
            tax,
            shippingFee,
            totalAmount,
            currency: "INR",
        },
    });
});