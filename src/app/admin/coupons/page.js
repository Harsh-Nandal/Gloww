"use client";

import { useEffect, useState } from "react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  // 🔄 Load coupons
  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // 🔁 Handle input
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ➕ CREATE COUPON
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscount: Number(form.maxDiscount),
        usageLimit: Number(form.usageLimit),
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "",
        isActive: true,
      });

      loadCoupons();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE COUPON
  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;

    try {
      await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      loadCoupons();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <h3 className="fw-bold mb-4">Coupons</h3>

      {/* ➕ CREATE FORM */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Create Coupon</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-4">
                <input
                  placeholder="Code"
                  className="form-control"
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={form.discountType}
                  onChange={(e) =>
                    handleChange("discountType", e.target.value)
                  }
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  placeholder="Discount Value"
                  className="form-control"
                  value={form.discountValue}
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  placeholder="Min Order"
                  className="form-control"
                  value={form.minOrderAmount}
                  onChange={(e) =>
                    handleChange("minOrderAmount", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  placeholder="Max Discount"
                  className="form-control"
                  value={form.maxDiscount}
                  onChange={(e) =>
                    handleChange("maxDiscount", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={form.expiryDate}
                  onChange={(e) =>
                    handleChange("expiryDate", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  placeholder="Usage Limit"
                  className="form-control"
                  value={form.usageLimit}
                  onChange={(e) =>
                    handleChange("usageLimit", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4 d-flex align-items-center">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.isActive}
                    onChange={(e) =>
                      handleChange("isActive", e.target.checked)
                    }
                  />
                  <label className="form-check-label">
                    Active
                  </label>
                </div>
              </div>

            </div>

            <button
              className="btn btn-primary mt-3"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>
      </div>

      {/* 📊 TABLE */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">

            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Expiry</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id}>
                    <td className="fw-semibold">{c.code}</td>
                    <td>{c.discountType}</td>
                    <td>
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>
                    <td>
                      {c.expiryDate
                        ? new Date(c.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          c.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-end">
                      <button
                        onClick={() => handleDelete(c._id)}
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