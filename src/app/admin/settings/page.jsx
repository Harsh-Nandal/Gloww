"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    storeName: "",
    logo: "",
    currency: "INR",
    email: "",
    phone: "",
    address: "",
    shippingCharge: 0,
    freeShippingLimit: 0,
    codEnabled: true,
    onlinePaymentEnabled: true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch settings
  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    if (data) setForm(data);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 🔹 Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Handle file
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // append all fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // append file
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Settings updated");
        fetchSettings();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">⚙️ Store Settings</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {/* STORE */}
        <h5 className="mb-3">Store Info</h5>

        <input
          name="storeName"
          className="form-control mb-3"
          value={form.storeName}
          onChange={handleChange}
          placeholder="Store Name"
        />

        {/* 🔥 LOGO UPLOAD */}
        <div className="mb-3">
          <label className="form-label">Upload Logo</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />

          {/* Preview */}
          {form.logo && (
            <img
              src={form.logo}
              alt="logo"
              style={{ width: 80, marginTop: 10 }}
            />
          )}
        </div>

        <select
          name="currency"
          className="form-control mb-4"
          value={form.currency}
          onChange={handleChange}
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
        </select>

        {/* CONTACT */}
        <h5 className="mb-3">Contact Info</h5>

        <input
          name="email"
          className="form-control mb-3"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          name="phone"
          className="form-control mb-3"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <textarea
          name="address"
          className="form-control mb-4"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />

        {/* SHIPPING */}
        {/* SHIPPING */}
        <h5 className="mb-3">Shipping Settings</h5>

        <div className="mb-3">
          <label className="form-label fw-semibold">Shipping Charge (₹)</label>
          <input
            type="number"
            name="shippingCharge"
            className="form-control"
            value={form.shippingCharge}
            onChange={handleChange}
            placeholder="Enter delivery charge (e.g. 50)"
          />
          <small className="text-muted">
            This charge will be applied if order value is below free shipping
            limit.
          </small>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">
            Free Shipping Minimum Order (₹)
          </label>
          <input
            type="number"
            name="freeShippingLimit"
            className="form-control"
            value={form.freeShippingLimit}
            onChange={handleChange}
            placeholder="Enter minimum order for free delivery (e.g. 1000)"
          />
          <small className="text-muted">
            Orders above this amount will get FREE delivery.
          </small>
        </div>

        {/* PAYMENT */}
        <h5 className="mb-3">Payment</h5>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            name="codEnabled"
            checked={form.codEnabled}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">Cash on Delivery</label>
        </div>

        <div className="form-check mb-4">
          <input
            type="checkbox"
            name="onlinePaymentEnabled"
            checked={form.onlinePaymentEnabled}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">Online Payment</label>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
