export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    // ✅ CONNECT DB FIRST
    await connectDB();

    // ✅ SAFE ADMIN VERIFY
    let admin;
    try {
      admin = verifyAdmin(req);
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ FETCH USERS
    const users = await User.find().select("-password");

    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}