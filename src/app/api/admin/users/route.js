import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  verifyAdmin(req);
  await connectDB();

  const users = await User.find().select("-password");

  return NextResponse.json(users);
}