import Link from "next/link";

import { buildJuiceMetadata } from "@/lib/juice-seo";

export const metadata = buildJuiceMetadata({
  title: "Carrito",
  description: "Carrito de compras de Dely Roses.",
  path: "/carrito",
  noIndex: true,
});

export default function CartPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Checkout</p>
      <h1 className="mt-3 text-foreground">Carrito listo para conectar</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        La ruta existe y queda marcada como no indexable. Cuando conectemos la lógica de compra, no afectará el SEO del catálogo.
      </p>
      <Link href="/productos" className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground">
        Seguir viendo productos
      </Link>
    </section>
  );
}
