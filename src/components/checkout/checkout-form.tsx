"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

import { getEnabledBankAccounts } from "@/data/payment";
import { getEnabledShippingSectors } from "@/data/shipping";
import { formatMoney } from "@/lib/money";
import { BankAccountsList } from "@/components/payment/bank-accounts-list";
import { getCartSubtotal, useCartStore } from "@/store/cart-store";

type CheckoutFormState = {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  shippingSectorSlug: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
};

type CreateOrderResponse = {
  orderNumber?: string;
  confirmationToken?: string;
  error?: string;
};

const initialFormState: CheckoutFormState = {
  fullName: "",
  email: "",
  phone: "",
  addressLine: "",
  shippingSectorSlug: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
};

export function CheckoutForm() {
  const shippingSectors = getEnabledShippingSectors();
  const bankAccounts = getEnabledBankAccounts();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = getCartSubtotal(items);
  const selectedShippingSector = shippingSectors.find((sector) => sector.slug === formData.shippingSectorSlug);
  const shippingAmount = selectedShippingSector?.price ?? 0;
  const total = subtotal + shippingAmount;

  function updateField(field: keyof CheckoutFormState, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });
      const data = (await response.json()) as CreateOrderResponse;

      if (!response.ok || !data.orderNumber || !data.confirmationToken) {
        throw new Error(data.error || "No se pudo crear el pedido.");
      }

      clearCart();
      router.push(`/confirmacion/${encodeURIComponent(data.confirmationToken)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el pedido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasHydrated) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">Cargando checkout...</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Checkout</p>
        <h1 className="mt-3 text-foreground">No hay productos para comprar</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Agrega productos al carrito antes de finalizar el pedido.
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
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Checkout</p>
        <h1 className="mt-3 text-foreground">Finalizar compra</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <User className="size-6 text-accent" aria-hidden="true" />
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Datos del cliente</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-foreground">Nombre completo *</span>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="Nombre y apellido"
                />
              </label>

              <label>
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Mail className="size-4 text-accent" aria-hidden="true" />
                  Email *
                </span>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="cliente@email.com"
                />
              </label>

              <label>
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Phone className="size-4 text-accent" aria-hidden="true" />
                  Teléfono / WhatsApp *
                </span>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="+593 99 999 9999"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="size-6 text-accent" aria-hidden="true" />
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Entrega</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="md:col-span-3">
                <span className="mb-2 block text-sm font-bold text-foreground">Sector de entrega *</span>
                <select
                  required
                  value={formData.shippingSectorSlug}
                  onChange={(event) => updateField("shippingSectorSlug", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                >
                  <option value="">Selecciona un sector</option>
                  {shippingSectors.map((sector) => (
                    <option key={sector.slug} value={sector.slug}>
                      {sector.name} - {formatMoney(sector.price)}
                    </option>
                  ))}
                </select>
                {selectedShippingSector ? (
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">{selectedShippingSector.description}</span>
                ) : null}
                {shippingSectors.length === 0 ? (
                  <span className="mt-2 block text-sm font-semibold text-destructive">
                    No hay sectores habilitados. Revisa <code>src/data/shipping/sectors.json</code>.
                  </span>
                ) : null}
              </label>

              <label className="md:col-span-3">
                <span className="mb-2 block text-sm font-bold text-foreground">Dirección</span>
                <input
                  type="text"
                  value={formData.addressLine}
                  onChange={(event) => updateField("addressLine", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="Calle, número, referencia"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-bold text-foreground">Ciudad</span>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="Ciudad"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-bold text-foreground">Provincia</span>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(event) => updateField("province", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="Provincia"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-bold text-foreground">Código postal</span>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(event) => updateField("postalCode", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-input px-4 text-foreground outline-none transition focus:border-primary"
                  placeholder="Código"
                />
              </label>
              <label className="md:col-span-3">
                <span className="mb-2 block text-sm font-bold text-foreground">Notas del pedido</span>
                <textarea
                  value={formData.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="min-h-28 w-full rounded-2xl border border-border bg-input px-4 py-3 text-foreground outline-none transition focus:border-primary"
                  placeholder="Dedicatoria, horario ideal, referencia adicional..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Building2 className="size-6 text-accent" aria-hidden="true" />
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Pago</h2>
            </div>
            <p className="mb-5 leading-7 text-muted-foreground">
              Realiza la transferencia a una de estas cuentas. Después de confirmar el pedido, envía la captura del comprobante por WhatsApp con el número de pedido.
            </p>
            <BankAccountsList accounts={bankAccounts} />
          </section>
        </div>

        <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Resumen del pedido</h2>
          <div className="mt-6 space-y-3 border-b border-border pb-6">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 text-sm text-muted-foreground">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="font-bold text-foreground">{formatMoney(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-b border-border pb-6 text-muted-foreground">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span className="font-bold text-foreground">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Envío</span>
              <span className="font-bold text-foreground">{formatMoney(shippingAmount)}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between gap-4 text-2xl font-bold text-foreground">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>

          {error ? <p className="mt-5 rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting || shippingSectors.length === 0}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition hover:bg-[#d98fa5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
            {isSubmitting ? "Guardando pedido..." : "Confirmar pedido"}
          </button>
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Al confirmar, se guardará el cliente, el pedido y los productos comprados en Supabase.
          </p>
        </aside>
      </form>
    </section>
  );
}
