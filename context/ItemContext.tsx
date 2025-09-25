// context/ItemContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { nanoid } from "nanoid";

export type Category = "Material" | "Flowers";

export type Item = {
  id: string;
  name: string;
  quantity: string;
  sku: string;
  history: string[];
  image?: string;
  category: Category;
};

type ItemContextType = {
  items: Item[];
  addItem: (name: string, quantity: string, sku: string, category: Category, image?: string) => void;
  updateItem: (id: string, name: string, quantity: string, sku: string, category: Category, image?: string) => void;
  deleteItem: (id: string) => void;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("items");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = (name: string, quantity: string, sku: string, category: Category, image?: string) => {
    setItems(prev => [
      ...prev,
      { id: nanoid(), name, quantity, sku, category, history: [quantity], image },
    ]);
  };

  const updateItem = (id: string, name: string, quantity: string, sku: string, category: Category, image?: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, name, quantity, sku, category, image: image ?? item.image, history: [...item.history, quantity] }
          : item
      )
    );
  };

  const deleteItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));

  return (
    <ItemContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItems() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("useItems must be used within ItemProvider");
  return ctx;
}