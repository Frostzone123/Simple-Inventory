"use client";
import React from "react";
import Link from "next/link";
import { Item } from "../../../context/ItemContext";
import { PencilIcon, MinusIcon } from "@heroicons/react/24/outline";

type ItemListProps = {
  items: Item[];
  onDelete?: (id: string) => void;
};

export function ItemList({ items, onDelete }: ItemListProps) {
  return (
    <ul className="bg-white rounded-lg shadow-sm divide-y divide-gray-200 overflow-hidden">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex justify-between items-center px-4 py-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-center space-x-3">
            {/* ✅ Show image if available */}
            {item.image && item.image.length > 0 ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md border"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}

            {/* Item info (name + qty on same line) */}
            <div className="flex flex-col">
              <span className="text-gray-900 font-medium">
                {item.name} <span className="text-gray-500 text-sm">(Qty: {item.quantity})</span>
              </span>
              <span className="text-gray-500 text-sm">
                SKU: {item.sku || "—"} | {item.category}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            {/* Edit button */}
            <Link href={`/edit/${item.id}`}>
              <div className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition">
                <PencilIcon className="h-4 w-4" />
              </div>
            </Link>
            {/* Delete button */}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}