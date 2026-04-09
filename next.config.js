/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",   // ✅ Cloudinary
      "lh3.googleusercontent.com", // ✅ Google images (optional)
      "images.unsplash.com",  // ✅ Unsplash (optional)
      "your-domain.com",      // ⚠️ replace with your backend domain if needed
    ],
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      iconv: false,
    };
    return config;
  },
};

module.exports = nextConfig;