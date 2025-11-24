"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { toast } from "sonner"; // Will be used later

// Define types
export type CartItem = {
  productId: string;
  variantId?: string;
  bakeSaleId?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  maxQuantity?: number; // For stock limits
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string, bakeSaleId?: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number,
    bakeSaleId?: string
  ) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bandofbakers-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Wrap in setTimeout to avoid synchronous state update warning
        setTimeout(() => setItems(parsedCart), 0);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    // Wrap in setTimeout to avoid synchronous state update warning
    setTimeout(() => setIsInitialized(true), 0);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("bandofbakers-cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          item.bakeSaleId === newItem.bakeSaleId
      );

      const quantityToAdd = newItem.quantity || 1;

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantityToAdd;

        // Check max quantity if applicable
        if (newItem.maxQuantity && updatedItems[existingItemIndex].quantity > newItem.maxQuantity) {
          updatedItems[existingItemIndex].quantity = newItem.maxQuantity;
          // Ideally show toast here
        }

        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, { ...newItem, quantity: quantityToAdd }];
      }
    });

    // Open cart drawer or show toast
    // setIsOpen(true);
  };

  const removeItem = (productId: string, variantId?: string, bakeSaleId?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variantId === variantId &&
            item.bakeSaleId === bakeSaleId
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    variantId: string | undefined,
    quantity: number,
    bakeSaleId?: string
  ) => {
    if (quantity < 1) {
      removeItem(productId, variantId, bakeSaleId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.productId === productId &&
          item.variantId === variantId &&
          item.bakeSaleId === bakeSaleId
        ) {
          // Check max quantity
          if (item.maxQuantity && quantity > item.maxQuantity) {
            return { ...item, quantity: item.maxQuantity };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isOpen,
        setIsOpen,
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
