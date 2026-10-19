"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartLine = { productSlug: string; variantId: string; quantity: number };

type StoreContextValue = {
  cart: CartLine[];
  ready: boolean;
  addItem: (productSlug: string, variantId: string, quantity?: number) => void;
  setQuantity: (productSlug: string, variantId: string, quantity: number) => void;
  removeItem: (productSlug: string, variantId: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const storageKey = "morrow-demo-cart-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed as CartLine[]);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, ready]);

  function addItem(productSlug: string, variantId: string, quantity = 1) {
    setCart((current) => {
      const found = current.find((line) => line.productSlug === productSlug && line.variantId === variantId);
      if (found) {
        return current.map((line) =>
          line === found ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [...current, { productSlug, variantId, quantity }];
    });
  }

  function setQuantity(productSlug: string, variantId: string, quantity: number) {
    setCart((current) =>
      quantity < 1
        ? current.filter((line) => line.productSlug !== productSlug || line.variantId !== variantId)
        : current.map((line) =>
            line.productSlug === productSlug && line.variantId === variantId
              ? { ...line, quantity }
              : line,
          ),
    );
  }

  function removeItem(productSlug: string, variantId: string) {
    setCart((current) =>
      current.filter((line) => line.productSlug !== productSlug || line.variantId !== variantId),
    );
  }

  return (
    <StoreContext.Provider value={{ cart, ready, addItem, setQuantity, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}