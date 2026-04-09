import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return Response.json(orders);
}