"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "../../components/NavBar";
import { BottomNav } from "../../components/BottomNav";
import { useItems, Category } from "../../../../context/ItemContext";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { items, updateItem } = useItems();

  const item = items.find(i => i.id === id);

  const [name, setName] = useState(item?.name ?? "");
  const [quantity, setQuantity] = useState(item?.quantity ?? "");
  const [sku, setSku] = useState(item?.sku ?? "");
  const [category, setCategory] = useState<Category>(item?.category ?? "Material");
  const [image, setImage] = useState<string | undefined>(item?.image);

  useEffect(() => {
    if (!item) router.push("/");
  }, [item, router]);

  const handleSave = () => {
    if (!item) return;
    updateItem(item.id, name, quantity, sku, category, image);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar title="Edit Item"/>
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

        <input type="file" accept="image/*" onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onloadend = () => setImage(reader.result as string);
          reader.readAsDataURL(file);
        }} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400 transition" />

        {image && <img src={image} className="w-28 h-28 object-cover rounded-md" alt="preview" />}

        <button
          onClick={handleSave}
          className="w-full bg-green-500 text-white p-3 rounded-lg"
        >
          Save
        </button>
      </div>
      <BottomNav/>
    </main>
  );
}