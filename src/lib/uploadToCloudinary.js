import cloudinary from "./cloudinary";

export const uploadToCloudinary = async (file, folder = "products") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};