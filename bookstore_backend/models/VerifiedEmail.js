const mongoose = require("mongoose");

const verifyEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // auto delete after 5 minutes
  },
});

verifyEmailSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("VerifiedEmail", verifyEmailSchema);
