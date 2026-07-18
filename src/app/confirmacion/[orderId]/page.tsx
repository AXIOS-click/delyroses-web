import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { getEnabledBankAccounts } from "@/data/payment";
import { BankAccountsList } from "@/components/payment/bank-accounts-list";
import { GoogleCustomerReviewsOptIn } from "@/components/google/customer-reviews-opt-in";
import { buildJuiceMetadata } from "@/lib/juice-seo";
import { toProductImageUrl } from "@/lib/images";
import { formatMoney } from "@/lib/money";
import { siteConfig } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type ConfirmationPageProps = {
  params: Promise<{ orderId: string }>;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  subtotal_amount: number | string;
  shipping_amount: number | string;
  total_amount: number | string;
  delivery_address: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  product_slug: string;
  product_name: string;
  product_category_name: string;
  product_image_url: string | null;
  unit_price: number | string;
  quantity: number;
  line_total: number | string;
};

export const metadata = buildJuiceMetadata({
  title: "Confirmación de pedido",
  description: "Confirmación de pedido de Dely Roses.",
  path: "/confirmacion",
  noIndex: true,
});

export const dynamic = "force-dynamic";

function toNumber(value: number | string | null | undefined) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function getShippingSectorName(deliveryAddress: Record<string, unknown> | null) {
  const shippingSector = deliveryAddress?.shippingSector;

  if (!shippingSector || typeof shippingSector !== "object" || Array.isArray(shippingSector)) return null;

  const name = (shippingSector as Record<string, unknown>).name;
  return typeof name === "string" && name.trim().length > 0 ? name : null;
}

function isConfirmationToken(value: string) {
  return /^[a-f0-9]{64}$/i.test(value);
}

function isOrderNumber(value: string) {
  return /^DR-[A-Z0-9]{10}$/i.test(value);
}

function normalizeOrderIdentifier(value: string) {
  const trimmedValue = value.trim();

  if (isConfirmationToken(trimmedValue)) return trimmedValue;
  if (isOrderNumber(trimmedValue)) return trimmedValue.toUpperCase();

  return null;
}

function getEstimatedDeliveryDate(createdAt: string) {
  const createdDate = new Date(createdAt);
  const deliveryDate = Number.isNaN(createdDate.getTime()) ? new Date() : createdDate;

  deliveryDate.setUTCDate(deliveryDate.getUTCDate() + 1);

  return deliveryDate.toISOString().slice(0, 10);
}

async function getOrderWithItems(orderIdentifier: string) {
  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_email, customer_name, customer_phone, subtotal_amount, shipping_amount, total_amount, delivery_address, notes, created_at",
    )
    .or(
      `confirmation_token.eq.${orderIdentifier},order_number.eq.${orderIdentifier}`,
    )
    .single();

  if (orderError || !order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_slug, product_name, product_category_name, product_image_url, unit_price, quantity, line_total")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    order: order as OrderRow,
    items: (items || []) as OrderItemRow[],
  };
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params;
  const orderIdentifier = normalizeOrderIdentifier(orderId);

  if (!orderIdentifier) notFound();

  const result = await getOrderWithItems(orderIdentifier);

  if (!result) notFound();

  const { order, items } = result;
  const bankAccounts = getEnabledBankAccounts();
  const shippingSectorName = getShippingSectorName(order.delivery_address);
  const estimatedDeliveryDate = getEstimatedDeliveryDate(order.created_at);
  const whatsappHref = siteConfig.whatsappUrl
    ? `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
        `Hola, adjunto la captura del comprobante de pago del pedido #${order.order_number}. Mi correo es ${order.customer_email}.`,
      )}`
    : undefined;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm md:p-10">
          <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden="true" />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.24em] text-accent">Pedido confirmado</p>
          <h1 className="mt-3 text-foreground">Gracias por comprar en Dely Roses</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Guardamos tu pedido con el número <strong className="text-foreground">#{order.order_number}</strong>. Para procesarlo, envía la captura del comprobante de pago por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-7 py-4 font-bold text-white transition hover:brightness-95"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Enviar comprobante por WhatsApp
              </a>
            ) : null}
            <Link href="/productos" className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-4 font-bold text-accent">
              Seguir comprando
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Lo que compraste</h2>
              <div className="mt-6 space-y-4">
                {items.map((item) => {
                  const imageUrl = toProductImageUrl(item.product_image_url);

                  return (
                    <article key={item.id} className="grid gap-4 rounded-[1.25rem] border border-border bg-background p-4 sm:grid-cols-[96px_1fr_auto]">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-rose">
                        {imageUrl ? (
                          <Image src={imageUrl} alt={item.product_name} fill sizes="96px" className="object-cover" unoptimized />
                        ) : (
                          <div className="grid size-full place-items-center text-xs font-bold uppercase tracking-[0.18em] text-accent">Sin imagen</div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{item.product_category_name}</p>
                        <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-foreground">{item.product_name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {formatMoney(toNumber(item.unit_price))} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-accent sm:text-right">{formatMoney(toNumber(item.line_total))}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-border bg-warning-soft p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Enviar comprobante</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Después de transferir, envía una captura del comprobante al WhatsApp de Dely Roses e incluye el pedido <strong className="text-foreground">#{order.order_number}</strong>.
              </p>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-success px-6 py-3 font-bold text-white transition hover:brightness-95"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Abrir WhatsApp
                </a>
              ) : null}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Resumen</h2>
              <dl className="mt-6 space-y-3 border-b border-border pb-6 text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <dt>Subtotal</dt>
                  <dd className="font-bold text-foreground">{formatMoney(toNumber(order.subtotal_amount))}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Envío{shippingSectorName ? ` (${shippingSectorName})` : ""}</dt>
                  <dd className="font-bold text-foreground">{formatMoney(toNumber(order.shipping_amount))}</dd>
                </div>
              </dl>
              <div className="mt-6 flex justify-between gap-4 text-2xl font-bold text-foreground">
                <span>Total</span>
                <span>{formatMoney(toNumber(order.total_amount))}</span>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Cuentas bancarias</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Transfiere a cualquiera de estas cuentas y envía la captura del comprobante.</p>
              <div className="mt-5">
                <BankAccountsList accounts={bankAccounts} compact />
              </div>
            </section>
          </aside>
        </div>
      </section>

      <GoogleCustomerReviewsOptIn
        merchantId={siteConfig.googleCustomerReviewsMerchantId}
        orderId={order.order_number}
        email={order.customer_email}
        deliveryCountry={siteConfig.countryCode}
        estimatedDeliveryDate={estimatedDeliveryDate}
      />
    </>
  );
}
