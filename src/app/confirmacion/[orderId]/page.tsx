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
      <h1 className="mt-3 text-foreground">Confirmación #{orderId}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Ruta privada preparada para confirmaciones. Está marcada como no indexable para evitar contenido duplicado o URLs sensibles en Google.
      </p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground">
        Volver al inicio
      </Link>
    </section>
  );
}
