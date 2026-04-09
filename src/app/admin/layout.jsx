"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, href, active }) => (
  <Link
    href={href}
    className={`d-flex align-items-center gap-3 p-3 rounded text-decoration-none fw-medium ${
      active
        ? "bg-primary text-white shadow-sm"
        : "text-secondary sidebar-link"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Products", icon: ShoppingBag, href: "/admin/products" },
    { label: "Coupons", icon: Ticket, href: "/admin/coupons" },
    { label: "Orders", icon: Users, href: "/admin/orders" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  // 🔥 LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      setLoading(true);

      // 👉 If you have logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // 👉 Clear localStorage (if used)
      localStorage.removeItem("token");

      // 👉 Redirect to login
      router.push("/login");

    } catch (err) {
      console.error(err);
      alert("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100 overflow-hidden">

      {/* 🔵 SIDEBAR */}
      <div
        className={`bg-dark text-white p-3 position-fixed h-100 sidebar ${
          isMobileOpen ? "show-sidebar" : ""
        }`}
        style={{ width: "250px", zIndex: 1050 }}
      >
        {/* Logo */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0">
            STORE<span className="text-primary">ADMIN</span>
          </h4>
          <button
            className="btn btn-sm btn-outline-light d-md-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="d-flex flex-column gap-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>

        {/* 🔥 LOGOUT (SIDEBAR BOTTOM) */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <LogOut size={18} />
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* 🔵 MAIN CONTENT */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px" }}
      >
        {/* HEADER */}
        <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary d-md-none"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={18} />
            </button>

            <h5 className="mb-0 text-capitalize fw-semibold">
              {pathname.split("/").pop()}
            </h5>
          </div>

          {/* 🔥 HEADER RIGHT */}
          <div className="d-flex align-items-center gap-3">

            {/* Profile */}
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "35px", height: "35px", fontSize: "14px" }}
            >
              AD
            </div>

            {/* 🔥 LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            >
              <LogOut size={16} />
              {loading ? "..." : "Logout"}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-auto bg-light" style={{ flex: 1 }}>
          {children}
        </div>
      </div>

      {/* 🔥 CUSTOM CSS */}
      <style jsx>{`
        .sidebar {
          display: flex;
          flex-direction: column;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white !important;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: all 0.3s ease;
          }

          .show-sidebar {
            transform: translateX(0);
          }

          .flex-grow-1 {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}