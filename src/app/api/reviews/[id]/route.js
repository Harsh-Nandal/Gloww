import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const review = await Review.findByIdAndDelete(params.id);

    // 🔥 Update product rating again
    const stats = await Review.aggregate([
      { $match: { product: review.product, isApproved: true } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(review.product, {
      ratingsAverage: stats[0]?.avgRating || 0,
      ratingsCount: stats[0]?.count || 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error deleting review" },
      { status: 500 }
    );
  }
}