import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    let amount = Number(body.amount);

    console.log("RAW AMOUNT FROM FRONTEND:", amount);

    // ❌ INVALID
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // 🔥 FIX 1: If amount looks too big → assume double multiplication
    if (amount > 50000000) {
      console.log("Fixing amount (dividing by 100)");
      amount = Math.floor(amount / 100);
    }

    // 🔥 FIX 2: STILL too big → reject safely
    if (amount > 50000000) {
      return NextResponse.json(
        { success: false, message: "Amount exceeds Razorpay limit" },
        { status: 400 }
      );
    }

    console.log("FINAL AMOUNT SENT TO RAZORPAY:", amount);

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.error?.description || "Order creation failed",
      },
      { status: 500 }
    );
  }
}