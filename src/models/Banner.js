import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    link: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner ||
  mongoose.model("Banner", bannerSchema);