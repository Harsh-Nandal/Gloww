import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const email = "admin@gmail.com";

    // ✅ Check if admin already exists
    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json({
        message: "Admin already exists",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // ✅ Create admin
    const admin = await User.create({
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin created successfully",
      admin,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}