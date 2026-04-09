import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: String,
    logo: String,
    currency: { type: String, default: "INR" },

    email: String,
    phone: String,
    address: String,

    shippingCharge: { type: Number, default: 0 },
    freeShippingLimit: { type: Number, default: 0 },

    codEnabled: { type: Boolean, default: true },
    onlinePaymentEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);