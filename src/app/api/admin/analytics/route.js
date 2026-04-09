import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find();

    // 🔹 Total Revenue
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.finalAmount || 0),
      0
    );

    // 🔹 Total Orders
    const totalOrders = orders.length;

    // 🔹 Avg Order Value
    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 🔹 Status Counts
    const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
    const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;
    const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;

    // 🔹 Customers
    const totalCustomers = await User.countDocuments();

    return Response.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
    });

  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}