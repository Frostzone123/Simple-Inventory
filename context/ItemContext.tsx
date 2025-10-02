"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Category = "Material" | "Flowers";

export type HistoryEntry = {
  quantity: number;
  date: string; // ISO string
};

export type Item = {
  id: string;
  name: string;
  quantity: number;
  sku: string;
  category: Category;
  image?: string;
  history: HistoryEntry[];
};

type ItemContextType = {
  items: Item[];
  fetchItems: () => Promise<void>;
  addItem: (name: string, quantity: number, sku: string, category: Category, image?: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<Omit<Item, "id" | "history">>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      const data: Item[] = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async (name: string, quantity: number, sku: string, category: Category, image?: string) => {
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, sku, category, image }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const newItem: Item = await res.json();
      setItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<Item, "id" | "history">>) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated: Item = await res.json();
      setItems(prev => prev.map(item => (item.id === id ? updated : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemContext.Provider value={{ items, fetchItems, addItem, updateItem, deleteItem }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemContext);
  if (!context) throw new Error("useItems must be used within an ItemProvider");
  return context;
}