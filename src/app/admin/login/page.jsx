"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 MUST FIX
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.success) {
        toast.success("Welcome Admin 🎉");

        router.replace("/admin/dashboard");
        router.refresh();
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-200"
      >
        <h1 className="text-2xl font-bold mb-6 text-center tracking-wide">
          Admin Login 🔐
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          value={form.email}
          className="border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none px-4 py-3 w-full mb-4 rounded-xl text-sm transition"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={form.password}
          className="border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none px-4 py-3 w-full mb-6 rounded-xl text-sm transition"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-black hover:bg-gray-900 text-white w-full py-3 rounded-xl font-medium transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
