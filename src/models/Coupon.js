import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
    },

    discountValue: Number,
    minOrderAmount: Number,
    maxDiscount: Number,

    expiryDate: Date,

    usageLimit: Number,

    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon ||
  mongoose.model("Coupon", couponSchema);