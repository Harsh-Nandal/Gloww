import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      items,
      totalAmount,
      discount = 0,
      finalAmount,
      couponCode,
      paymentStatus = "paid",
      orderStatus = "processing",
      address,
    } = body;

    // 🔐 GET USER FROM TOKEN
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // ❌ Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No order items" },
        { status: 400 }
      );
    }

    if (!finalAmount) {
      return NextResponse.json(
        { success: false, message: "Final amount required" },
        { status: 400 }
      );
    }

    // 🧾 CREATE ORDER
    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount,
      discount,
      finalAmount,
      couponCode,
      paymentStatus,
      orderStatus,

      address,

      timeline: [
        {
          status: "Order placed",
          date: new Date(),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Order creation failed" },
      { status: 500 }
    );
  }
}