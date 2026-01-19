const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const sendEmail = require("../utils/email");

router.post(
  "/",
  protect,
  asyncErrorHandler(async (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userEmail = req.user.email;

    //send message to my email
    const html = `
                <h2>BookStore User</h2>
                <br/>
                <br/>
                <h1>${name}</h1>
                <br/>
                <br/>
                <p>${message}</p>
                <br/>
                <br/>
                <p>Regards,</p>
                <p>${userEmail}</p>
                `;

    try {
      await sendEmail({
        email: "aakshit906@gmail.com",
        subject: "BookStore User Message",
        html,
      });
    } catch (error) {
      return new Error(error);
    }

    res.json({
      status: "success",
      message: "Mail sent successfully",
    });
  }),
);

module.exports = router;
