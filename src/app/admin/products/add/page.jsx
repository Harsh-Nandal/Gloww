"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    stock: "",
    isFeatured: false,
    isPublished: true,
  });

  // 🔄 Load categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // 🔁 Handle change
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 2); // max 2

    setImages(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  // ➕ Add category
  const handleAddCategory = async () => {
    if (!newCategory) return;

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategory }),
    });

    setNewCategory("");

    // reload categories
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
  };

  // 🚀 Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      if (images.length === 0) {
        alert("Please upload at least 1 image");
        setUploading(false); // ✅ ADD THIS
        return;
      }
      // 🔥 Convert images to base64
      const imageBase64 = await Promise.all(
        images.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        }),
      );

      // 📦 Payload
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        stock: Number(form.stock),
        images: imageBase64, // ✅ send base64 to backend
      };

      // 🚀 Send to backend
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      {/* ➕ ADD CATEGORY */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Add Category</h3>

        <div className="flex gap-2">
          <input
            placeholder="Category Name"
            className="border p-2 w-full"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={handleAddCategory}
            className="bg-black text-white px-4"
          >
            Add
          </button>
        </div>
      </div>

      {/* 🧾 PRODUCT FORM */}
      <form onSubmit={handleSubmit} className="container mt-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h4 className="mb-4 fw-bold text-dark">Add New Product</h4>

            {/* BASIC INFO */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="product-slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Write product description..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* PRICE */}
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="₹ 0"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Discount Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="₹ 0"
                  value={form.discountPrice}
                  onChange={(e) =>
                    handleChange("discountPrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* CATEGORY + BRAND */}
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brand name"
                  value={form.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
              </div>
            </div>

            {/* IMAGES */}
            <div className="mt-3">
              <label className="form-label">
                Upload Product Images (Max 2)
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                className="form-control"
                onChange={handleImageChange}
              />

              {/* Preview */}
              <div className="d-flex gap-3 mt-3">
                {preview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* STOCK */}
            <div className="mt-3">
              <label className="form-label">Stock</label>
              <input
                type="number"
                className="form-control"
                placeholder="Available stock"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
              />
            </div>

            {/* CHECKBOXES */}
            <div className="d-flex flex-wrap gap-4 mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => handleChange("isFeatured", e.target.checked)}
                  id="featured"
                />
                <label className="form-check-label" htmlFor="featured">
                  Featured Product
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    handleChange("isPublished", e.target.checked)
                  }
                  id="published"
                />
                <label className="form-check-label" htmlFor="published">
                  Published
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="btn btn-primary w-100 mt-4 py-2 fw-semibold"
              disabled={uploading}
            >
              {uploading ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
