"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Category = "Material" | "Flowers";

export interface Item {
  id: string;
  name: string;
  quantity: number;
  sku?: string;
  category: Category;
  image?: string; // filename
  history?: { id: string; quantity: number; createdAt: string }[];
}

interface ItemContextType {
  items: Item[];
  loading: boolean;
  addItem: (item: Omit<Item, "id" | "history">) => Promise<void>;
  updateItem: (id: string, updates: Partial<Omit<Item, "id" | "history">>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) throw new Error("useItems must be used within an ItemProvider");
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const ItemProvider = ({ children }: ProviderProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token") || "";

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch items");
      const data: Item[] = await res.json();
      setItems(data);
    } catch (err) {
      console.error("fetchItems error:", err);
      setItems([]); // ensure items is at least an empty array
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<Item, "id" | "history">) => {
    try {
      const token = getToken();
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to add item");
      await fetchItems();
    } catch (err) {
      console.error("addItem error:", err);
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<Item, "id" | "history">>) => {
    try {
      const token = getToken();
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update item");
      await fetchItems();
    } catch (err) {
      console.error("updateItem error:", err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      await fetchItems();
    } catch (err) {
      console.error("deleteItem error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemContext.Provider
      value={{ items, loading, addItem, updateItem, deleteItem, fetchItems }}
    >
      {children}
    </ItemContext.Provider>
  );
};