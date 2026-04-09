import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true, // 🔥 important
      trim: true,
    },

    password: { 
      type: String, 
      required: true 
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBlocked: { 
      type: Boolean, 
      default: false 
    },

    addresses: [addressSchema],

    // 🔐 FORGOT PASSWORD FIELDS
    resetToken: {
      type: String,
      default: null,
      index: true, // 🔥 fast lookup
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);