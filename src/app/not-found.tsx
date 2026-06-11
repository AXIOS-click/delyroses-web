import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">404</p>
      <h1 className="mt-3 text-foreground">Página no encontrada</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        La URL no existe o el producto todavía no está cargado en el catálogo JSON.
      </p>
      <Link href="/productos" className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground">
        Ir al catálogo
      </Link>
    </section>
  );
}
