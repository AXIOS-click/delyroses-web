import Link from "next/link";

import { buildJuiceMetadata } from "@/lib/juice-seo";

export const metadata = buildJuiceMetadata({
  title: "Finalizar compra",
  description: "Finalización de compra de Dely Roses.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Pago</p>
      <h1 className="mt-3 text-foreground">Checkout preparado</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Esta página se mantiene fuera del índice de buscadores y queda lista para integrar pagos, WhatsApp o confirmación manual.
      </p>
      <Link href="/productos" className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground">
        Volver al catálogo
      </Link>
    </section>
  );
}
