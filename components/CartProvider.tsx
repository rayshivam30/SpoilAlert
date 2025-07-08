"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  async function fetchCartCount() {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartCount(Array.isArray(data.cartItems) ? data.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0);
      }
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    fetchCartCount();
  }, []);

  const refreshCart = fetchCartCount;

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a CartProvider");
  return ctx;
} 