const mongoose = require("mongoose");
const crypto = require("crypto");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    otp: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

otpSchema.methods.isOtpValid = async function (otp) {
  const hashedInputOtp = crypto.createHash("sha256").update(otp).digest("hex");

  return hashedInputOtp === this.otp;
};

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", otpSchema);
