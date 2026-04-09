import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    // 🔐 AUTH CHECK
    verifyAdmin(req);

    await connectDB();

    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ]);

    const revenue = revenueData[0]?.total || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    return NextResponse.json({
      success: true,
      users,
      products,
      orders,
      revenue,
      recentOrders,
    });
  } catch (error) {
    console.log("❌ DASHBOARD ERROR:", error.message);

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}