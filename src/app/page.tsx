"use client";

import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { BottomNav } from "./components/BottomNav";
import { ItemList } from "./components/ItemList";
import { useItems } from "../../context/ItemContext";

export default function Home() {
  const { items, deleteItem } = useItems();
  const [filter, setFilter] = useState<"All" | "Materials" | "Flowers">("All");

  // ✅ Apply filtering
  const filteredItems =
    filter === "All" ? items : items.filter((item) => item.category === filter);

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar />
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex justify-center space-x-4 bg-white shadow p-3 rounded-md">
          {["All", "Material", "Flower"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as "All" | "Materials" | "Flowers")}
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
          <ItemList items={filteredItems} onDelete={deleteItem} />
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