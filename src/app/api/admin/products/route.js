import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

// GET PRODUCTS
export async function GET(req) {
  try {
    await verifyAdmin(req);
    await connectDB();

    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 401 }
    );
  }
}

// CREATE PRODUCT
export async function POST(req) {
  try {
    await verifyAdmin(req);
    await connectDB();

    const body = await req.json();

    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      stock,
      isFeatured,
      isPublished,
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Name, price and category are required" },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    const existing = await Product.findOne({ slug: finalSlug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    const uploadedImages = await Promise.all(
      images.map((img) => uploadToCloudinary(img, "products"))
    );

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      brand,
      images: uploadedImages,
      stock: Number(stock) || 0,
      isFeatured: isFeatured || false,
      isPublished: isPublished ?? true,
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}