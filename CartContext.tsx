"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string; // unique in cart (e.g. T10036-BASIC)
  baseId: string; // real item id (e.g. T10036)
  title: string;
  priceRwf: number;
  type: "TRACK" | "SOUND_KIT" | "MERCH" | "MEMBERSHIP";
  licenseType?: "BASIC" | "PREMIUM" | "UNLIMITED";
  deliverables?: string[];
  usageLimits?: Record<string, string | number>;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalRwf: number;
  count: number;
};

const CartCtx = createContext<CartState | null>(null);
const LS_KEY = "yewebeatz_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartState>(() => {
    const totalRwf = items.reduce((s, i) => s + i.priceRwf, 0);
    return {
      items,
      add: (item) =>
        setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item])),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
      totalRwf,
      count: items.length,
    };
  }, [items]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
