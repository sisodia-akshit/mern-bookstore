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
      console.log("working")
      await sendEmail({
        email: "aakshit906@gmail.com",
        subject: "BookStore User Message",
        html,
      });
      console.log("working 2")


      res.json({
        status: "success",
        message: "Mail sent successfully",
      });
    } catch (error) {
      return new Error(error);
    }
  }),
);

module.exports = router;
