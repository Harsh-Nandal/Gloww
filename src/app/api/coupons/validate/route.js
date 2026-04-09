import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const code = body?.code?.trim();

    // ✅ 1. CHECK CODE
    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    // ✅ 2. FIND COUPON
    const coupon = await Coupon.findOne({
      code: { $regex: `^${code}$`, $options: "i" },
    });

    console.log("Coupon found:", coupon);

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon" },
        { status: 404 }
      );
    }

    // ✅ 3. GET TOTAL
    const totalRaw = body?.total;

    if (totalRaw === undefined || totalRaw === null) {
      return NextResponse.json(
        { success: false, message: "Cart total missing" },
        { status: 400 }
      );
    }

    const total = Number(totalRaw);

    if (isNaN(total)) {
      return NextResponse.json(
        { success: false, message: "Invalid cart total" },
        { status: 400 }
      );
    }

    // ❌ EXPIRED
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json(
        { success: false, message: "Coupon expired" },
        { status: 400 }
      );
    }

    // ❌ INACTIVE
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, message: "Coupon inactive" },
        { status: 400 }
      );
    }

    // ❌ VALUE CHECK
    if (
      coupon.discountValue === null ||
      coupon.discountValue === undefined ||
      isNaN(Number(coupon.discountValue))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon value" },
        { status: 500 }
      );
    }

    // 🔥 MIN ORDER CHECK
    if (coupon.minOrderAmount && total < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order should be ₹${coupon.minOrderAmount}`,
        },
        { status: 400 }
      );
    }

    // 🔥 CALCULATE DISCOUNT
    let type = "flat";
    let value = 0;

    if (coupon.discountType === "percentage") {
      type = "percent";

      const calculated = (total * coupon.discountValue) / 100;

      // ✅ APPLY MAX DISCOUNT
      value = coupon.maxDiscount
        ? Math.min(calculated, coupon.maxDiscount)
        : calculated;

    } else if (coupon.discountType === "fixed") {
      type = "flat";
      value = coupon.discountValue;
    }

    // ✅ SUCCESS
    return NextResponse.json({
      success: true,
      type,
      value: Math.round(value),
      code: coupon.code,
    });

  } catch (error) {
    console.error("Coupon API Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}