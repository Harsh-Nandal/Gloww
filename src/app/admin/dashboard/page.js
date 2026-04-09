"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Loader2,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, bg }) => (
  <div className="col-md-6 col-lg-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="text-uppercase text-muted small fw-semibold mb-1">
            {title}
          </p>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle ${bg}`}
          style={{ width: "50px", height: "50px" }}
        >
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Loader2 className="spin text-primary" size={35} />
        <style jsx>{`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      
      {/* 🔹 STATS */}
      <div className="row g-4">
        <StatCard
          title="Revenue"
          value={`₹${data?.revenue || 0}`}
          icon={DollarSign}
          bg="bg-success"
        />
        <StatCard
          title="Orders"
          value={data?.orders || 0}
          icon={ShoppingCart}
          bg="bg-primary"
        />
        <StatCard
          title="Products"
          value={data?.products || 0}
          icon={Package}
          bg="bg-purple"
        />
        <StatCard
          title="Users"
          value={data?.users || 0}
          icon={Users}
          bg="bg-warning"
        />
      </div>

      {/* 🔹 RECENT ORDERS */}
      <div className="card mt-4 shadow-sm border-0">
        <div className="card-header bg-white fw-bold">
          Recent Transactions
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data?.recentOrders?.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-medium">
                      {order.user?.name || "Guest"}
                    </td>
                    <td>₹{order.finalAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.paymentStatus === "paid"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 EXTRA STYLING */}
      <style jsx>{`
        .bg-purple {
          background-color: #6f42c1;
        }
      `}</style>
    </div>
  );
}
