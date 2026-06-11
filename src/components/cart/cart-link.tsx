"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { getCartItemsCount, useCartStore } from "@/store/cart-store";

export function CartLink() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const itemsCount = hasHydrated ? getCartItemsCount(items) : 0;

  return (
    <Link
      href="/carrito"
      className="relative inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:border-primary"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      Carrito
      {itemsCount > 0 ? (
        <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-white">
          {itemsCount}
        </span>
      ) : null}
    </Link>
  );
}
