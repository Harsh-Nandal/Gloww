import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Optional (if user is logged in)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Required Product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    // Guest User Info (IMPORTANT)
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email"],
    },

    // Rating
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },

    // Review Text
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },

    // Admin Control
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Prevent duplicate reviews (same email per product)
reviewSchema.index({ product: 1, email: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);