import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";


// 🔹 GET ALL COUPONS
export async function GET() {
  try {
    await connectDB();

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: coupons.length,
      coupons,
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


// 🔹 CREATE COUPON
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    let {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
      isActive,
    } = body;

    // 🔥 VALIDATION
    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        { success: false, message: "Code, type and value are required" },
        { status: 400 }
      );
    }

    // 🔥 FORCE UPPERCASE
    code = code.toUpperCase();

    // 🔥 CHECK DUPLICATE
    const existing = await Coupon.findOne({ code });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // 🔥 CREATE COUPON
    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      expiryDate: expiryDate || null,
      usageLimit: Number(usageLimit) || 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });

  } catch (err) {
    console.error(err);

    // 🔥 HANDLE DUPLICATE ERROR (fallback)
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate coupon code" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}