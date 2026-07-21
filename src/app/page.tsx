import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";

import { CategoryCarousel } from "@/components/catalog/category-carousel";
import { EmptyProducts } from "@/components/catalog/empty-products";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getFeaturedProducts } from "@/data/catalog";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildJuiceMetadata, buildWebPageJsonLd } from "@/lib/juice-seo";

const homeTitle = "Arreglos florasre con envio quito | DELY ROSES";
const homeDescription =
  "Dely Roses prepara rosas frescas, ramos y arreglos florales delicados para regalos románticos, aniversarios y ocasiones especiales.";

export const metadata = buildJuiceMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "/",
  keywords: ["comprar rosas", "arreglos florales románticos", "ramos de rosas"],
});

export default function HomePage() {
  const categories = getCategories();
  const featuredProducts = getFeaturedProducts(4);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({ name: homeTitle, description: homeDescription, path: "/" }),
          buildBreadcrumbJsonLd([{ name: "Inicio", path: "/" }]),
          ...(featuredProducts.length > 0 ? [buildItemListJsonLd("Productos destacados", "/", featuredProducts)] : []),
        ]}
      />

      <section className="overflow-hidden border-b border-border bg-[linear-gradient(135deg,#fff9f7_0%,#fff1f4_48%,#fff4ea_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-24 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit rounded-full bg-card px-4 py-2 text-sm font-bold text-accent shadow-sm">
              Rosas frescas, detalles suaves y regalos listos para enamorar
            </p>
            <h1 className="mt-6 max-w-3xl text-foreground">Flores y arreglos que conquistan</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Floristería en Quito especializada en arreglos florales, bouquets y flores a domicilio para cumpleaños, aniversarios, graduaciones, celebraciones y ocasiones especiales. Encuentra rosas, flores frescas, regalos y diseños personalizados con servicio de entrega en Quito
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
            <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-foreground">Nuestras categorías especiales para tí</h2>
          </div>
        </div>
        <CategoryCarousel categories={categories} />
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
