"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/orders");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      // ✅ FIX: handle correct structure
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error("FETCH ORDER ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });

      // ✅ Optimistic UI update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, orderStatus: status } : o
        )
      );
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Orders CRM</h2>

      {/* FILTER BUTTONS */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {[
          "all",
          "new",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn ${
              filter === status ? "btn-dark" : "btn-outline-dark"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ minWidth: "320px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o._id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push(`/admin/orders/${o._id}`)
                    }
                  >
                    <td>{o.user?.name || "Guest"}</td>
                    <td>{o.items?.length || 0} items</td>
                    <td>₹{o.finalAmount}</td>

                    <td>
                      <span
                        className={`badge ${
                          o.paymentStatus === "paid"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-info text-dark text-capitalize">
                        {o.orderStatus}
                      </span>
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex flex-wrap gap-1">
                        <button
                          onClick={() =>
                            router.push(`/admin/orders/${o._id}`)
                          }
                          className="btn btn-sm btn-dark"
                        >
                          View / Edit
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(o._id, "pending")
                          }
                          className="btn btn-sm btn-warning"
                        >
                          Pending
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(o._id, "processing")
                          }
                          className="btn btn-sm btn-primary"
                        >
                          Process
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(o._id, "shipped")
                          }
                          className="btn btn-sm btn-secondary"
                        >
                          Ship
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(o._id, "delivered")
                          }
                          className="btn btn-sm btn-success"
                        >
                          Deliver
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(o._id, "cancelled")
                          }
                          className="btn btn-sm btn-danger"
                        >
                          Cancel
                        </button>
                      </div>
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