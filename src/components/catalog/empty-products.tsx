import Link from "next/link";

export function EmptyProducts() {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Catálogo listo</p>
      <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground">Aún no hay productos cargados</h2>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
        Agrega productos en <code className="rounded bg-muted px-1.5 py-0.5">src/data/catalog/products.json</code> con nombre,
        descripción, precio, URLs de imagen, categoría y etiquetas. La app los validará al arrancar.
      </p>
      <Link
        href="/productos"
        className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-[#d98fa5]"
      >
        Ver estructura del catálogo
      </Link>
    </div>
  );
}
