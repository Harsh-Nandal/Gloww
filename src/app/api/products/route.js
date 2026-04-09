import {connectDB} from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return Response.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error); // 👈 IMPORTANT

    return Response.json(
      {
        message: "Error fetching products",
        error: error.message, // 👈 FIXED
      },
      { status: 500 }
    );
  }
}