"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../components/NavBar";
import { BottomNav } from "../components/BottomNav";
import { useLoading } from "../../../context/LoadingContext";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

export default function MembersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  const { setLoading } = useLoading();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch users
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          isAdmin: newIsAdmin,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add user");
      }

      alert(`New user created: ${newUsername}`);
      setNewUsername("");
      setNewPassword("");
      setNewIsAdmin(false);
      setShowAddForm(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle isAdmin
  const toggleAdmin = async (id: number, current: boolean) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !current }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <NavBar title="Members" />

      <div className="max-w-md mx-auto p-4 space-y-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
        >
          {showAddForm ? "Cancel" : "Add New User"}
        </button>

        {showAddForm && (
          <form
            onSubmit={handleAddUser}
            className="bg-white p-4 rounded-md shadow-md space-y-3"
          >
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring text-black focus:ring-blue-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring text-black focus:ring-blue-300"
              required
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newIsAdmin}
                onChange={(e) => setNewIsAdmin(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700 text-sm">Make Admin</span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Create User
            </button>
          </form>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white p-3 rounded-md flex justify-between items-center shadow-sm"
            >
              <div>
                <span className="font-semibold text-black">{user.username}</span>
                {user.isAdmin && (
                  <span className="ml-2 text-sm text-green-600">(Admin)</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAdmin(user.id, user.isAdmin)}
                  className="px-2 py-1 text-sm bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Toggle Admin
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}