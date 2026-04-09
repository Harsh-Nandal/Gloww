"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  // 🔄 Load Products
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/products");

      // ✅ FIX: handle API errors properly
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      // ✅ FIX: handle all possible API shapes
      const finalProducts =
        data.products || data.data || data || [];

      setProducts(Array.isArray(finalProducts) ? finalProducts : []);
    } catch (err) {
      console.error("PRODUCT FETCH ERROR:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ❌ Delete Product
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete request failed");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Delete failed");
      }

      // ✅ BETTER: update UI instantly (no refetch lag)
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="container py-4">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Products</h3>

        <button
          onClick={() => router.push("/admin/products/add")}
          className="btn btn-dark"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-danger">
                    {error}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    
                    {/* PRODUCT */}
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt="product"
                            style={{
                              width: "45px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                        <div>
                          <div className="fw-medium">{p.name}</div>
                          <small className="text-muted">{p.brand}</small>
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td>
                      <div className="fw-semibold">₹{p.price}</div>
                      {p.discountPrice > 0 && (
                        <small className="text-muted text-decoration-line-through">
                          ₹{p.discountPrice}
                        </small>
                      )}
                    </td>

                    {/* STOCK */}
                    <td>
                      {p.stock > 0 ? (
                        <span className="badge bg-success">
                          {p.stock} in stock
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Out of stock
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`badge ${
                          p.isPublished ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* FEATURED */}
                    <td>
                      {p.isFeatured ? (
                        <span className="badge bg-warning text-dark">
                          ★ Featured
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="text-end">
                      <button
                        onClick={() =>
                          router.push(`/admin/products/edit/${p._id}`)
                        }
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}