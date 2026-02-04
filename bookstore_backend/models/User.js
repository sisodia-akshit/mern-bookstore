const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      select: false,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["admin", "operator", "seller", "user"],
      default: "user",
    },
    photo: {
      type: String,
    },

    addresses: [
      {
        name: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
        country: {
          type: String,
          enum: [
            "India"
          ],
          default: "India"
        },
        isDefault: Boolean,
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      max: 5,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.provider !== "local") return;
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    return jwtTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000);
  }
  return false;
};

userSchema.methods.isLockedOut = function () {
  return this.lockoutUntil && this.lockoutUntil > Date.now();
};

userSchema.index({ name: "text" });
userSchema.index({ isActive: 1 });
userSchema.index({ passwordResetToken: 1 });

module.exports = mongoose.model("User", userSchema);
