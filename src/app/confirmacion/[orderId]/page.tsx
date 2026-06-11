import Link from "next/link";

import { buildJuiceMetadata } from "@/lib/juice-seo";

type ConfirmationPageProps = {
  params: Promise<{ orderId: string }>;
};

export const metadata = buildJuiceMetadata({
  title: "Confirmación de pedido",
  description: "Confirmación de pedido de Dely Roses.",
  path: "/confirmacion",
  noIndex: true,
});

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Pedido</p>
      <h1 className="mt-3 text-foreground">Pedido confirmado</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Guardamos tu pedido en Dely Roses con el número <strong className="text-foreground">#{orderId}</strong>. Esta página no se indexa en buscadores.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground">
          Volver al inicio
        </Link>
        <Link href="/productos" className="inline-flex rounded-full border border-border bg-card px-7 py-4 font-bold text-accent">
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}
