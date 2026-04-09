import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],

    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Cart ||
  mongoose.model("Cart", cartSchema);