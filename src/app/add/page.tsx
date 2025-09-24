"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../components/NavBar";
import { BottomNav } from "../components/BottomNav";
import { useItems } from "../../../context/ItemContext";

export default function AddPage() {
  const router = useRouter();
  const { addItem } = useItems();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!name || !quantity) return;
    addItem(name, quantity, sku, image);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar title="Add Item" />
      <div className="max-w-md mx-auto p-4 space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     text-black placeholder-gray-400 transition"
        />
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     text-black placeholder-gray-400 transition"
        />
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     text-black placeholder-gray-400 transition"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     text-black placeholder-gray-400 transition"
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-2 w-24 h-24 object-cover rounded-lg"
        />
        )}
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 hover:bg-blue-600 
                     text-white py-3 rounded-lg font-semibold transition"
        >
          Add Item
        </button>
      </div>
      <BottomNav />
    </main>
  );
}