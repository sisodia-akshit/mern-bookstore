const nodemailer = require("nodemailer");
const sendEmail = async (option) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  // define mail
  const mailOptions = {
    from: "BookStore support<support@bookstore.com>",
    to: option.email,
    subject: option.subject,
    html: option.html,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
