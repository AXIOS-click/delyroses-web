import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";

import { EmptyProducts } from "@/components/catalog/empty-products";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getFeaturedProducts } from "@/data/catalog";
import { buildItemListJsonLd, buildJuiceMetadata } from "@/lib/juice-seo";

export const metadata = buildJuiceMetadata({
  title: "Rosas y arreglos florales para regalar",
  description:
    "Dely Roses prepara rosas frescas, ramos y arreglos florales delicados para regalos románticos, aniversarios y ocasiones especiales.",
  path: "/",
  keywords: ["comprar rosas", "arreglos florales románticos", "ramos de rosas"],
});

export default function HomePage() {
  const categories = getCategories();
  const featuredProducts = getFeaturedProducts(4);

  return (
    <>
      {featuredProducts.length > 0 ? <JsonLd data={buildItemListJsonLd("Productos destacados", "/", featuredProducts)} /> : null}

      <section className="overflow-hidden border-b border-border bg-[linear-gradient(135deg,#fff9f7_0%,#fff1f4_48%,#fff4ea_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-24 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit rounded-full bg-card px-4 py-2 text-sm font-bold text-accent shadow-sm">
              Rosas frescas, detalles suaves y regalos listos para enamorar
            </p>
            <h1 className="mt-6 max-w-3xl text-foreground">Flores que se sienten personales desde el primer vistazo.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Base SEO y catálogo preparados para vender rosas, ramos y arreglos florales con páginas estáticas, imágenes optimizadas y datos estructurados.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground transition hover:bg-[#d98fa5]"
              >
                Ver catálogo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/categoria/rosa"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-4 font-bold text-accent shadow-sm transition hover:border-primary"
              >
                Arreglos con rosas
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px] rounded-[2.5rem] border border-border bg-card p-5 shadow-2xl shadow-[#b86b84]/10">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-secondary blur-3xl" />
            <div className="absolute -bottom-8 left-8 size-32 rounded-full bg-surface-warm blur-3xl" />
            <div className="relative grid h-full place-items-center rounded-[2rem] bg-surface-rose p-8 text-center">
              <div>
                <Flower2 className="mx-auto size-16 text-accent" aria-hidden="true" />
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-accent">Dely Roses</p>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Categorías</p>
            <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-foreground">Estructura lista para crecer</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="rounded-[1.75rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{category.slug}</p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-foreground">{category.name}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Productos</p>
            <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-foreground">Destacados</h2>
          </div>
          <Link href="/productos" className="hidden font-bold text-accent hover:underline sm:inline-flex">
            Ver todos
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyProducts />
        )}
      </section>
    </>
  );
}
