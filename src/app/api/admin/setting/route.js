import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import cloudinary from "@/config/cloudinary";

// 🔹 GET
export async function GET() {
  await connectDB();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return Response.json(settings);
}


// 🔹 UPDATE WITH IMAGE UPLOAD
export async function PUT(req) {
  await connectDB();

  const formData = await req.formData();

  const data = {};
  let logoUrl = null;

  // extract fields
  for (let [key, value] of formData.entries()) {
    if (key !== "logo") {
      data[key] = value;
    }
  }

  // 🔥 HANDLE IMAGE
  const file = formData.get("logo");

  if (file && file.name) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "settings" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    logoUrl = uploadRes.secure_url;
    data.logo = logoUrl;
  }

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(data);
  } else {
    settings = await Settings.findByIdAndUpdate(
      settings._id,
      data,
      { new: true }
    );
  }

  return Response.json({ success: true, settings });
}