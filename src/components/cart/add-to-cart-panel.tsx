"use client";

import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

import type { CartProductInput } from "@/store/cart-store";
import { useCartStore } from "@/store/cart-store";

type AddToCartPanelProps = {
  product: CartProductInput;
};

export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    addItem(product, quantity);
    router.push("/carrito");
  }

  return (
    <div className="mt-8 rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
      <label className="block text-sm font-bold text-foreground">Cantidad</label>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex w-fit items-center overflow-hidden rounded-full border border-border bg-background">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="grid size-11 place-items-center text-foreground transition hover:bg-muted"
            aria-label="Restar una unidad"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center font-bold text-foreground">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(99, current + 1))}
            className="grid size-11 place-items-center text-foreground transition hover:bg-muted"
            aria-label="Sumar una unidad"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition hover:bg-[#d98fa5]"
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
