import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();

  const user = await User.findByIdAndUpdate(
    params.id,
    {
      role: body.role,
      isBlocked: body.isBlocked,
    },
    { new: true }
  ).select("-password");

  return Response.json(user);
}

export async function DELETE(req, { params }) {
  await connectDB();

  await User.findByIdAndDelete(params.id);
  return Response.json({ message: "User deleted" });
}