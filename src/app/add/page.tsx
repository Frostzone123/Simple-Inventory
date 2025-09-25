"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../components/NavBar";
import { BottomNav } from "../components/BottomNav";
import { useItems, Category } from "../../../context/ItemContext";

export default function AddPage() {
  const { addItem } = useItems();
  const router = useRouter();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<Category>("Material");
  const [image, setImage] = useState<string | undefined>(undefined);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!name || !quantity) return;
    addItem(name, quantity, sku, category, image);
    router.push("/");
  };

  return (
    
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar title="Add Item" />
      <div className="max-w-md mx-auto p-4 space-y-4">
        <input
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400 transition"
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400 transition"
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400 transition"    
          placeholder="SKU"
          value={sku}
          onChange={e => setSku(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400 transition" 
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          <option value="Material">Material</option>
          <option value="Flowers">Flowers</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400 transition"
        />
        {image && <img src={image} className="w-28 h-28 object-cover rounded-md" alt="preview" />}

        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white p-3 rounded-lg"
        >
          Add
        </button>
      </div>
      <BottomNav/>
    </main>
  );
}