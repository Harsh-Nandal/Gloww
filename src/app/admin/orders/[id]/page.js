"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 🔹 Fetch Order
  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setOrder(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  // 🔹 Update Status
  const updateStatus = async (status) => {
    try {
      setActionLoading(true);

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setOrder((prev) => ({
        ...prev,
        orderStatus: status,
      }));

      alert("Order updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 Delete Order
  const deleteOrder = async () => {
    const confirmDelete = confirm("Delete this order?");
    if (!confirmDelete) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Order deleted successfully");
      router.push("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (!order) return <p className="p-4">Order not found</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Order Details</h2>

      {/* USER INFO */}
      <div className="card mb-4 p-3">
        <h5>User</h5>
        <p><strong>Name:</strong> {order.user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
      </div>

      {/* ORDER INFO */}
      <div className="card mb-4 p-3">
        <h5>Order Info</h5>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Payment:</strong> {order.paymentStatus}</p>
        <p><strong>Total:</strong> ₹{order.finalAmount}</p>
      </div>

      {/* ADDRESS */}
      <div className="card mb-4 p-3">
        <h5>Shipping Address</h5>
        <p>{order.address?.fullName || "-"}</p>
        <p>{order.address?.street || "-"}</p>
        <p>
          {order.address?.city || "-"},{" "}
          {order.address?.state || "-"}
        </p>
        <p>{order.address?.postalCode || "-"}</p>
        <p>{order.address?.phone || "-"}</p>
      </div>

      {/* ITEMS */}
      <div className="card mb-4 p-3">
        <h5>Items</h5>

        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>

          <tbody>
            {order.items?.length > 0 ? (
              order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="card p-3">
        <h5>Actions</h5>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            disabled={actionLoading}
            onClick={() => updateStatus("pending")}
            className="btn btn-warning"
          >
            Pending
          </button>

          <button
            disabled={actionLoading}
            onClick={() => updateStatus("processing")}
            className="btn btn-primary"
          >
            Processing
          </button>

          <button
            disabled={actionLoading}
            onClick={() => updateStatus("shipped")}
            className="btn btn-secondary"
          >
            Shipped
          </button>

          <button
            disabled={actionLoading}
            onClick={() => updateStatus("delivered")}
            className="btn btn-success"
          >
            Delivered
          </button>

          <button
            disabled={actionLoading}
            onClick={() => updateStatus("cancelled")}
            className="btn btn-danger"
          >
            Cancelled
          </button>
        </div>

        <button
          disabled={actionLoading}
          onClick={deleteOrder}
          className="btn btn-outline-danger"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
}