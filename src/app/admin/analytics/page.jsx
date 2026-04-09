"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  const fetchAnalytics = async () => {
    const res = await fetch("/api/admin/analytics");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data) return <p className="p-4">Loading analytics...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📊 Analytics Dashboard</h2>

      {/* TOP CARDS */}
      <div className="row g-3 mb-4">
        <Card title="Total Revenue" value={`₹${data.totalRevenue}`} />
        <Card title="Total Orders" value={data.totalOrders} />
        <Card title="Avg Order Value" value={`₹${data.avgOrderValue}`} />
        <Card title="Pending Orders" value={data.pendingOrders} />
      </div>

      {/* EXTRA STATS */}
      <div className="row g-3">
        <Card title="Delivered Orders" value={data.deliveredOrders} />
        <Card title="Cancelled Orders" value={data.cancelledOrders} />
        <Card title="Total Customers" value={data.totalCustomers} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="col-md-3">
      <div className="card shadow-sm p-3">
        <h6 className="text-muted">{title}</h6>
        <h4 className="fw-bold">{value}</h4>
      </div>
    </div>
  );
}