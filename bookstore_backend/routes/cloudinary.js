// routes/cloudinary.js
const router = require("express").Router();
const cloudinary = require("../config/cloudinary");

router.get("/signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: "books",
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});

module.exports = router;
