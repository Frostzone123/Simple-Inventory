"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "../../components/NavBar";
import { BottomNav } from "../../components/BottomNav";
import { useItems } from "../../../../context/ItemContext";

export default function EditItem() {
  const router = useRouter();
  const params = useParams();
  const { items, updateItem } = useItems();
  const id = params.id as string;

  const item = items.find((i) => i.id === id);

  const [name, setName] = useState(item?.name || "");
  const [quantity, setQuantity] = useState(item?.quantity || "");
  const [sku, setSku] = useState(item?.sku || ""); 
  const [image, setImage] = useState(item?.image);

  useEffect(() => {
    if (!item) router.push("/"); // redirect if item not found
  }, [item, router]);

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

  const handleSave = () => {
    if (!name || !quantity) return;
    updateItem(id, name, quantity, sku, image);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <NavBar title="Edit Item" />
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="space-y-4">
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
            onClick={handleSave}
            className="w-full bg-green-500 hover:bg-green-600 
                       text-white py-3 rounded-lg font-semibold transition"
          >
            Save
          </button>
        </div>

        {/* Quantity History */}
        {item && item.history && item.history.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-gray-800 font-semibold mb-2">Quantity History</h2>
            <ul className="space-y-1 text-gray-600 text-sm">
              {item.history.map((q, idx) => (
                <li key={idx}>
                  {idx + 1}. {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}