import jwt from "jsonwebtoken";

export const verifyAdmin = (req) => {
  try {
    const token = req.cookies.get("token")?.value;

    console.log("🔑 TOKEN:", token);

    if (!token) {
      throw new Error("No token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ DECODED:", decoded);

    if (decoded.role !== "admin") {
      throw new Error("Not admin");
    }

    return decoded;
  } catch (err) {
    console.log("❌ VERIFY ERROR:", err.message);
    throw new Error("Unauthorized");
  }
};