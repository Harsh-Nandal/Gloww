import { NextResponse } from "next/server";
import Product from "@/models/Product";
import {connectDB} from "@/lib/mongodb";

export async function GET(req, { params }) {
  await connectDB();

  const product = await Product.findById(params.id);

  return NextResponse.json(product);
}