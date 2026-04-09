import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // ❌ Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Connect DB
    await connectDB();

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🎯 HANDLE ROLE (ENUM SAFE)
    let userRole = "user"; // default

    if (role && ["user", "admin"].includes(role)) {
      userRole = role;
    }

    // ⚠️ SECURITY: prevent random admin creation
    // 👉 You can restrict admin creation like this:
    // if (role === "admin") return error OR check secret key

    // ✅ Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}