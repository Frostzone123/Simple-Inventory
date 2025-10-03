"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "./components/NavBar";
import { BottomNav } from "./components/BottomNav";
import { ItemList } from "./components/ItemList";
import { useItems } from "../../context/ItemContext";

export default function Home() {
  const router = useRouter();
  const { items, deleteItem, fetchItems } = useItems();
  const [filter, setFilter] = useState<"All" | "Material" | "Flowers">("All");
  const [loading, setLoading] = useState(true);

  // Fetch items on mount and redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchItems()
      .catch((err) => {
        console.error("Failed to fetch items:", err);
        localStorage.removeItem("token"); // invalidate token
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [fetchItems, router]);

  // Filter items based on selected category
  const filteredItems =
    filter === "All" ? items : items.filter((item) => item.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar />
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex justify-center space-x-4 bg-white shadow p-3 rounded-md">
          {["All", "Material", "Flowers"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as "All" | "Material" | "Flowers")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === option
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Item List */}
        {filteredItems.length > 0 ? (
          <ItemList
            items={filteredItems}
            onDelete={(id) => deleteItem(id)}
          />
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No items in this category.
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}