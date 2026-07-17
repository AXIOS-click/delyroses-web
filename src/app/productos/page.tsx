import Link from "next/link";

import { EmptyProducts } from "@/components/catalog/empty-products";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getProducts, getTags } from "@/data/catalog";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildJuiceMetadata } from "@/lib/juice-seo";

export const metadata = buildJuiceMetadata({
  title: "Catálogo de rosas y arreglos florales",
  description:
    "Explora el catálogo de Dely Roses con rosas, ramos y arreglos florales organizados por categorías y etiquetas.",
  path: "/productos",
  keywords: ["catálogo floral", "comprar flores", "productos florales"],
});

export default function ProductsPage() {
  const products = getProducts();
  const categories = getCategories();
  const tags = getTags();

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
          ]),
          buildItemListJsonLd("Catálogo de Dely Roses", "/productos", products),
        ]}
      />

      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Catálogo</p>
          <h1 className="mt-3 max-w-4xl text-foreground">Rosas y arreglos florales</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Descubre nuestra colección de rosas, bouquets y arreglos florales elaborados con flores frescas. Diseños personalizados y flores a domicilio en Quito para cumpleaños, aniversarios, celebraciones y momentos especiales.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-6">
          <div className="rounded-[1.5rem] border border-border bg-card p-5">
            <p className="font-bold text-foreground">Categorías</p>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categoria/${category.slug}`}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-card p-5">
            <p className="font-bold text-foreground">Etiquetas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.slug} className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 rounded-[1.25rem] border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
            Mostrando {products.length} producto{products.length === 1 ? "" : "s"} cargado{products.length === 1 ? "" : "s"} desde JSON.
          </div>

          {products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}
        </div>
      </section>
    </>
  );
}
