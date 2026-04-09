import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";


// 🔹 GET SINGLE PRODUCT
export async function GET(req, { params }) {
  try {
    verifyAdmin(req);
    await connectDB();

    const product = await Product.findById(params.id).populate("category");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 404 }
    );
  }
}


// 🔹 UPDATE PRODUCT
export async function PUT(req, { params }) {
  try {
    verifyAdmin(req);
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

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 🔥 Handle Images Smartly
    let updatedImages = product.images;

    if (images && images.length > 0) {
      updatedImages = [];

      for (let img of images) {
        // Only upload if it's base64 (new image)
        if (img.startsWith("data:")) {
          const url = await uploadToCloudinary(img, "products");
          updatedImages.push(url);
        } else {
          // Already existing URL
          updatedImages.push(img);
        }
      }
    }

    // 🔥 Slug auto-generate if empty
    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

    const updated = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        slug: finalSlug,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        category,
        brand,
        images: updatedImages,
        stock: Number(stock) || 0,
        isFeatured: isFeatured || false,
        isPublished: isPublished ?? true,
      },
      { new: true }
    ).populate("category");

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}


// 🔹 DELETE PRODUCT
export async function DELETE(req, { params }) {
  try {
    verifyAdmin(req);
    await connectDB();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}