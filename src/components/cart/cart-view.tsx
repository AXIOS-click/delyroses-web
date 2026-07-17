"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";

import { toProductImageUrl } from "@/lib/images";
import { formatMoney } from "@/lib/money";
import { getCartItemsCount, getCartSubtotal, useCartStore } from "@/store/cart-store";

export function CartView() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = getCartSubtotal(items);
  const itemsCount = getCartItemsCount(items);

  if (!hasHydrated) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">Cargando carrito...</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Carrito</p>
        <h1 className="mt-3 text-foreground">Tu carrito está vacío</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Agrega rosas o arreglos florales al carrito para continuar con el checkout.
        </p>
        <Link href="/productos" className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground">
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Carrito</p>
        <h1 className="mt-3 text-foreground">Carrito de compras</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => {
            const imageUrl = toProductImageUrl(item.imageUrl);

            return (
              <article key={item.productId} className="grid gap-4 rounded-[1.5rem] border border-border bg-card p-4 shadow-sm sm:grid-cols-[112px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-surface-rose">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.name} fill sizes="112px" className="object-cover" unoptimized />
                  ) : (
                    <div className="grid size-full place-items-center text-xs font-bold uppercase tracking-[0.18em] text-accent">Sin imagen</div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{item.categoryName}</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-foreground">{item.name}</h2>
                  <p className="mt-2 font-bold text-accent">{formatMoney(item.price)}</p>

                  <div className="mt-4 flex w-fit items-center overflow-hidden rounded-full border border-border bg-background">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="grid size-10 place-items-center transition hover:bg-muted"
                      aria-label={`Restar ${item.name}`}
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-11 text-center font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="grid size-10 place-items-center transition hover:bg-muted"
                      aria-label={`Sumar ${item.name}`}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-xl font-bold text-foreground">{formatMoney(item.price * item.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-muted-foreground transition hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Quitar
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Resumen</h2>
          <div className="mt-6 space-y-3 border-b border-border pb-6 text-muted-foreground">
            <div className="flex justify-between gap-4">
              <span>Subtotal ({itemsCount} producto{itemsCount === 1 ? "" : "s"})</span>
              <span className="font-bold text-foreground">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Envío</span>
              <span className="font-bold text-foreground">Se calcula en checkout</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between gap-4 text-2xl font-bold text-foreground">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">El costo de envío se suma al elegir el sector de entrega en el checkout.</p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition hover:bg-[#d98fa5]"
          >
            Continuar compra
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/productos" className="mt-3 block text-center text-sm font-bold text-accent hover:underline">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </section>
  );
}
