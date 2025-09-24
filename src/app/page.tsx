"use client";

import { NavBar } from "./components/NavBar";
import { BottomNav } from "./components/BottomNav";
import { ItemList } from "./components/ItemList";
import { useItems } from "../../context/ItemContext";

export default function Home() {
  const { items, deleteItem } = useItems();

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar />
      <div className="max-w-md mx-auto p-4 space-y-4">
        <ItemList items={items} onDelete={deleteItem} />
      </div>
      <BottomNav />
    </main>
  );
}