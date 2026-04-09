import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const review = await Review.findByIdAndUpdate(
      params.id,
      { isApproved: true },
      { new: true }
    );

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

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error approving review" },
      { status: 500 }
    );
  }
}