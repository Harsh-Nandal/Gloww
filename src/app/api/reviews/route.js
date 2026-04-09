import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { product, name, email, rating, comment } = body;

    if (!product || !name || !email || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Create review
    const review = await Review.create({
      product,
      name,
      email,
      rating,
      comment,
    });

    // 🔥 Update product rating
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

    await Product.findByIdAndUpdate(product, {
      ratingsAverage: stats[0]?.avgRating || 0,
      ratingsCount: stats[0]?.count || 0,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.log(error);

    // Duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "You already reviewed this product" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product");

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching reviews" },
      { status: 500 },
    );
  }
}
