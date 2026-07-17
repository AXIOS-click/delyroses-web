import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { AddToCartPanel } from "@/components/cart/add-to-cart-panel";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/data/catalog";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildJuiceMetadata, buildProductJsonLd } from "@/lib/juice-seo";
import { formatMoney } from "@/lib/money";
import { siteConfig } from "@/lib/site";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return buildJuiceMetadata({
      title: "Producto no encontrado",
      description: "El producto solicitado no existe en el catálogo de Dely Roses.",
      path: `/producto/${slug}`,
      noIndex: true,
    });
  }

  return buildJuiceMetadata({
    title: product.name,
    description: product.description,
    path: product.urlPath,
    keywords: [...product.categories.map((category) => category.name), ...product.tags.map((tag) => tag.name)],
    images: product.primaryImageUrl
      ? [{ url: product.primaryImageUrl, width: 1200, height: 1200, alt: product.name }]
      : undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);
  const categoryNames = product.categories.map((category) => category.name).join(" · ");

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
            { name: product.category.name, path: `/categoria/${product.category.slug}` },
            { name: product.name, path: product.urlPath },
          ]),
          buildProductJsonLd(product),
          buildItemListJsonLd(`Productos relacionados con ${product.name}`, product.urlPath, relatedProducts),
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al catálogo
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-surface-rose">
              {product.primaryImageUrl ? (
                <Image src={product.primaryImageUrl} alt={product.name} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" priority />
              ) : (
                <div className="grid size-full place-items-center px-8 text-center text-sm font-bold uppercase tracking-[0.24em] text-accent">
                  Imagen pendiente
                </div>
              )}
            </div>

            {product.imageUrls.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.imageUrls.slice(1).map((imageUrl) => (
                  <div key={imageUrl} className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-rose">
                    <Image src={imageUrl} alt={product.name} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:pt-8">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">{categoryNames}</p>
            <h1 className="mt-3 text-foreground">{product.name}</h1>
            <p className="mt-5 text-4xl font-bold text-accent">{formatMoney(product.price)}</p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{product.description}</p>

            <div className="mt-8 grid gap-5">
              <section className="rounded-[1.5rem] border border-border bg-card p-5">
                <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">Composición floral</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.composition.map((flower) => (
                    <span key={flower} className="rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
                      {flower}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-border bg-card p-5">
                <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">Presentación</h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                  {product.presentation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[1.5rem] border border-border bg-card p-5">
                <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">Notas importantes</h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                  {product.importantNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag.slug} className="rounded-full bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
                  {tag.name}
                </span>
              ))}
            </div>

            <AddToCartPanel
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageUrl: product.primaryImageUrl,
                categorySlug: product.category.slug,
                categoryName: product.category.name,
              }}
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {siteConfig.whatsappUrl ? (
                <a
                  href={`${siteConfig.whatsappUrl}?text=${encodeURIComponent(`Hola, quiero consultar por ${product.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-7 py-4 font-bold text-white transition hover:brightness-95"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Consultar por WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">También te puede gustar</p>
              <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-foreground">Productos relacionados</h2>
            </div>
            <Link href={`/categoria/${product.category.slug}`} className="font-bold text-accent hover:underline">
              Ver más en {product.category.name}
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
