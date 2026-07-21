"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // product id
  title: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: {
      id: string;
      title?: string;
      name?: string;
      price: number;
      image_url: string;
      quantity?: number;
      stock: number;
    },
    quantity: number,
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const savedCart = localStorage.getItem("yoeyarzay_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const normalized: CartItem[] = parsed
            .filter((item: unknown): item is Record<string, unknown> =>
              Boolean(item && typeof item === "object"),
            )
            .map((item) => ({
              id: String(item.id || item.product_id || ""),
              title: String(item.title || item.name || ""),
              price: Number(item.price) || 0,
              image_url: String(item.image_url || ""),
              quantity: Number(item.quantity) || 1,
              stock: Number(item.stock) || 0,
            }))
            .filter((item) => Boolean(item.id));
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(normalized);
        }
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Save to local storage whenever items change
    if (mounted) {
      localStorage.setItem("yoeyarzay_cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (
    product: {
      id: string;
      title?: string;
      name?: string;
      price: number;
      image_url: string;
      quantity?: number;
      stock: number;
    },
    quantity: number,
  ) => {
    const productTitle = product.title || product.name || "";
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                title: item.title || productTitle,
                quantity: Math.min(item.quantity + quantity, item.stock),
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: productTitle,
          price: Number(product.price),
          image_url: product.image_url,
          quantity,
          stock: product.stock,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: Math.min(Math.max(1, quantity), item.stock),
          };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
