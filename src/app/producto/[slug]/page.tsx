import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { AddToCartPanel } from "@/components/cart/add-to-cart-panel";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getFixedInternalProducts, getProductBySlug, getProducts } from "@/data/catalog";
import { getEnabledShippingSectors } from "@/data/shipping";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildJuiceMetadata,
  buildProductJsonLd,
  buildProductReviewText,
  productEditorialRating,
  productReturnPolicyPath,
  productReturnPolicyText,
} from "@/lib/juice-seo";
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

  const internalProducts = getFixedInternalProducts(product);
  const categoryNames = product.categories.map((category) => category.name).join(" · ");
  const shippingSectors = getEnabledShippingSectors();
  const shippingSummary = shippingSectors.map((sector) => `${sector.name}: ${formatMoney(sector.price)}`).join(" · ");
  const productReviewText = buildProductReviewText(product);

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
          buildItemListJsonLd("Productos recomendados de Dely Roses", product.urlPath, internalProducts),
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al catálogo
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="sticky top-24 z-10 self-start">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-surface-rose">
              {product.primaryImageUrl ? (
                <Image src={product.primaryImageUrl} alt={product.name} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" priority unoptimized />
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
                    <Image src={imageUrl} alt={product.name} fill sizes="120px" className="object-cover" unoptimized />
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
                <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">Información para compra</h2>
                <dl className="mt-4 grid gap-4 text-sm leading-6 sm:grid-cols-2">
                  <div>
                    <dt className="font-bold text-foreground">Marca</dt>
                    <dd className="text-muted-foreground">{siteConfig.name}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-foreground">SKU</dt>
                    <dd className="text-muted-foreground">{product.id}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-bold text-foreground">Entrega local</dt>
                    <dd className="text-muted-foreground">
                      {siteConfig.city}, {siteConfig.countryName}. {shippingSummary}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-bold text-foreground">Política de devolución</dt>
                    <dd className="text-muted-foreground">
                      {productReturnPolicyText} <Link href={productReturnPolicyPath} className="font-bold text-accent hover:underline">Ver política completa</Link>
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-[1.5rem] border border-border bg-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">Reseña del equipo</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{productReviewText}</p>
                  </div>
                  <div className="w-fit rounded-full bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
                    {productEditorialRating.value}/{productEditorialRating.bestRating}
                  </div>
                </div>
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

      {internalProducts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Enlaces internos</p>
              <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-foreground">Más arreglos de Dely Roses</h2>
            </div>
            <Link href="/productos" className="font-bold text-accent hover:underline">
              Ver catálogo completo
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {internalProducts.map((internalProduct) => (
              <ProductCard key={internalProduct.id} product={internalProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
