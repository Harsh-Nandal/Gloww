import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// 🔹 GET SINGLE ORDER (THIS WAS MISSING ❗)
export async function GET(req, { params }) {
  try {
    await connectDB();

    const order = await Order.findById(params.id)
      .populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


// 🔹 UPDATE ORDER
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        $set: { orderStatus: body.orderStatus },
        $push: {
          timeline: {
            status: body.orderStatus,
          },
        },
      },
      { new: true }
    );

    return NextResponse.json(order);

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}


// 🔹 DELETE ORDER (OPTIONAL BUT RECOMMENDED)
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    await Order.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}