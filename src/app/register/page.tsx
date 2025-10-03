"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../components/NavBar";
import { BottomNav } from "../components/BottomNav";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminCheckbox, setIsAdminCheckbox] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check if the current user is admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) router.push("/"); // redirect non-admins
      })
      .catch(() => router.push("/login"))
      .finally(() => setCheckingAdmin(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password,
          isAdmin: isAdminCheckbox,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register user");

      setSuccess("User registered successfully!");
      setUsername("");
      setPassword("");
      setIsAdminCheckbox(false);
    } catch (err: any) {
      setError(err.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) return <p className="p-4">Checking permissions...</p>;

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* NavBar with Back Button */}
      <NavBar
        title="Register User"
      >
      </NavBar>

      {/* Form */}
      <div className="max-w-md mx-auto p-4 mt-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md w-full space-y-4"
        >
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring text-black focus:ring-blue-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring text-black focus:ring-blue-300"
            required
          />

          {/* Admin Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAdminCheckbox}
              onChange={(e) => setIsAdminCheckbox(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-700 text-sm">Make Admin</span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}