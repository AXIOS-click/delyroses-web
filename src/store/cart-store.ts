"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartProductInput = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  categorySlug: string;
  categoryName: string;
};

export type CartItem = CartProductInput & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  addItem: (product: CartProductInput, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(99, Math.floor(quantity)));
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemsCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      addItem: (product, quantity = 1) => {
        const safeQuantity = normalizeQuantity(quantity);

        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.productId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, ...product, quantity: normalizeQuantity(item.quantity + safeQuantity) }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: safeQuantity }],
          };
        });
      },
      updateQuantity: (productId, quantity) => {
        const safeQuantity = normalizeQuantity(quantity);

        set((state) => ({
          items: state.items.map((item) => (item.productId === productId ? { ...item, quantity: safeQuantity } : item)),
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "dely-roses-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
