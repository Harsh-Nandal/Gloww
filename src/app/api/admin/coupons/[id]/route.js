import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// 🔹 GET SINGLE ORDER
export async function GET(req, { params }) {
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
}


// 🔹 UPDATE ORDER
export async function PUT(req, { params }) {
  await connectDB();

  const body = await req.json();

  const updated = await Order.findByIdAndUpdate(
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

  return NextResponse.json(updated);
}


// 🔹 DELETE ORDER
export async function DELETE(req, { params }) {
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
}