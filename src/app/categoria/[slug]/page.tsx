import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyProducts } from "@/components/catalog/empty-products";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getCategoryBySlug, getProductsByCategory, isPrimaryCategory } from "@/data/catalog";
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
    noIndex: !isPrimaryCategory(category),
    follow: true,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const heading = category.guide?.length && category.seoTitle
    ? category.seoTitle
    : `Arreglos florales con ${category.name.toLocaleLowerCase("es")} en Quito`;

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
          <h1 className="text-foreground">{heading}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{category.description}</p>
          <Link href="/productos" className="mt-5 inline-flex text-sm font-bold text-accent hover:underline">
            Ver catálogo completo
          </Link>
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

      {category.guide?.length ? (
        <section aria-label={`Guía de ${category.name.toLocaleLowerCase("es")}`} className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:px-8">
          {category.guide.map(({ heading, body }) => (
            <div key={heading} className="max-w-3xl">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">{heading}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
