"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }) {
  const router = useRouter();

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

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]); // new files
  const [preview, setPreview] = useState([]); // preview
  const [uploading, setUploading] = useState(false);

  // 🔄 Load data
  useEffect(() => {
    const fetchData = async () => {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/admin/products/${params.id}`),
        fetch(`/api/admin/categories`),
      ]);

      const productData = await pRes.json();
      const cats = await cRes.json();

      const p = productData.product;

      setForm({
        name: p.name || "",
        slug: p.slug || "",
        description: p.description || "",
        price: p.price || "",
        discountPrice: p.discountPrice || "",
        category: p.category?._id || p.category || "",
        brand: p.brand || "",
        stock: p.stock || "",
        isFeatured: p.isFeatured || false,
        isPublished: p.isPublished ?? true,
      });

      setPreview(p.images || []); // old images
      setCategories(cats);
    };

    fetchData();
  }, [params.id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 📸 IMAGE CHANGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 2);

    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previewUrls);
  };

  // 🚀 UPDATE PRODUCT
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      let imageBase64 = [];

      // 🔥 convert only if new images selected
      if (images.length > 0) {
        imageBase64 = await Promise.all(
          images.map((file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
            });
          })
        );
      }

      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : 0,
        stock: Number(form.stock),
        images: imageBase64, // backend handles cloudinary
      };

      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      router.push("/admin/products");
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">Edit Product</h4>

          <form onSubmit={handleUpdate}>

            {/* NAME + SLUG */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input
                  className="form-control"
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
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>

            {/* PRICE */}
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Discount Price"
                  value={form.discountPrice}
                  onChange={(e) =>
                    handleChange("discountPrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div className="mt-3">
              <select
                className="form-select"
                value={form.category}
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 🖼️ IMAGE UPLOAD */}
            <div className="mt-4">
              <label className="form-label fw-semibold">
                Upload New Images (optional)
              </label>

              <input
                type="file"
                multiple
                className="form-control"
                onChange={handleImageChange}
              />

              <div className="d-flex gap-3 mt-3 flex-wrap">
                {preview.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* STOCK */}
            <div className="mt-3">
              <input
                type="number"
                className="form-control"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
              />
            </div>

            {/* CHECKBOXES */}
            <div className="mt-3 d-flex gap-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    handleChange("isFeatured", e.target.checked)
                  }
                />
                <label className="form-check-label">
                  Featured
                </label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.isPublished}
                  onChange={(e) =>
                    handleChange("isPublished", e.target.checked)
                  }
                />
                <label className="form-check-label">
                  Published
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="btn btn-primary w-100 mt-4"
              disabled={uploading}
            >
              {uploading ? "Updating..." : "Update Product"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}