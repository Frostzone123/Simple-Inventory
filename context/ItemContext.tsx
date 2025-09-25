"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { nanoid } from "nanoid";

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
  addItem: (name: string, quantity: number, sku: string, category: Category, image?: string) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, "id" | "history">>) => void;
  deleteItem: (id: string) => void;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  // Load items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("items");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  // Persist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = (name: string, quantity: number, sku: string, category: Category, image?: string) => {
    const newItem: Item = {
      id: nanoid(),
      name,
      quantity,
      sku,
      category,
      image,
      history: [{ quantity, date: new Date().toISOString() }],
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<Omit<Item, "id" | "history">>) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newQuantity = updates.quantity ?? item.quantity;
        return {
          ...item,
          ...updates,
          history: [...item.history, { quantity: newQuantity, date: new Date().toISOString() }],
        };
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ItemContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemContext);
  if (!context) throw new Error("useItems must be used within an ItemProvider");
  return context;
}