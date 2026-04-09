import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },

    description: String,

    price: { type: Number, required: true },
    discountPrice: Number,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    brand: String,

    images: [String],

    stock: { type: Number, default: 0 },

    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);