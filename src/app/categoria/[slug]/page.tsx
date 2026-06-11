import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyProducts } from "@/components/catalog/empty-products";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/data/catalog";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildJuiceMetadata } from "@/lib/juice-seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return buildJuiceMetadata({
      title: "Categoría no encontrada",
      description: "La categoría solicitada no existe en el catálogo de Dely Roses.",
      path: `/categoria/${slug}`,
      noIndex: true,
    });
  }

  return buildJuiceMetadata({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
    path: `/categoria/${category.slug}`,
    keywords: [category.name, category.slug],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
            { name: category.name, path: `/categoria/${category.slug}` },
          ]),
          buildItemListJsonLd(category.name, `/categoria/${category.slug}`, products),
        ]}
      />

      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Categoría</p>
          <h1 className="mt-3 text-foreground">{category.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
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
