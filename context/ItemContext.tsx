"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { nanoid } from "nanoid";

export type Item = {
  id: string;
  name: string;
  quantity: string;
  sku: string;
  history: string[];
  image?: string; // Base64 image or URL
};

type ItemContextType = {
  items: Item[];
  addItem: (name: string, quantity: string, sku: string, image?: string) => void;
  updateItem: (id: string, name: string, quantity: string, sku: string, image?: string) => void;
  deleteItem: (id: string) => void;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("items");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = (name: string, quantity: string, sku: string, image?: string) => {
    setItems([
      ...items,
      { id: nanoid(), name, quantity, sku, history: [quantity], image },
    ]);
  };

  const updateItem = (id: string, name: string, quantity: string, sku: string, image?: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              quantity,
              sku,
              image: image ?? item.image,
              history: [...item.history, quantity],
            }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <ItemContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) throw new Error("useItems must be used within an ItemProvider");
  return context;
};