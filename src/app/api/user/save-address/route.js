import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    let { fullName, phone, addressLine, city, state, pincode, email } = body;

    // ✅ CLEAN DATA
    fullName = fullName?.trim();
    phone = phone?.trim();
    addressLine = addressLine?.trim();
    city = city?.trim();
    state = state?.trim();
    pincode = pincode?.trim();
    email = email?.trim();

    // ✅ VALIDATION (ACCORDING TO SCHEMA)
    if (!fullName || !phone || !addressLine || !city || !state || !pincode || !email) {
      return NextResponse.json(
        { success: false, message: "All fields are required ❌" },
        { status: 400 }
      );
    }

    // ✅ FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found ❌" },
        { status: 404 }
      );
    }

    // ✅ MATCHES YOUR addressSchema EXACTLY
    const newAddress = {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
    };

    // ✅ CHECK DUPLICATE (OPTIONAL BUT GOOD)
    const alreadyExists = user.addresses.some(
      (addr) =>
        addr.addressLine === addressLine &&
        addr.pincode === pincode
    );

    if (!alreadyExists) {
      user.addresses.push(newAddress);
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: alreadyExists
        ? "Address already exists ✅"
        : "Address saved successfully ✅",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("SAVE ADDRESS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error ❌" },
      { status: 500 }
    );
  }
}