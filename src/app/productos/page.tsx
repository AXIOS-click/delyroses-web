import Link from "next/link";

import { EmptyProducts } from "@/components/catalog/empty-products";
import { ProductCard } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getProducts, getTags, searchProducts } from "@/data/catalog";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildJuiceMetadata } from "@/lib/juice-seo";

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const productsPerPage = 24;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSearchQuery(value: string | string[] | undefined) {
  return (getSingleParam(value) || "").trim().slice(0, 80);
}

function getPageNumber(value: string | string[] | undefined) {
  const page = Number.parseInt(getSingleParam(value) || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function buildProductsUrl(query: string, page: number) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString ? `/productos?${queryString}` : "/productos";
}

function getPaginationItems(currentPage: number, pageCount: number) {
  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1].filter((page) => page >= 1 && page <= pageCount));
  const sortedPages = Array.from(pages).sort((first, second) => first - second);
  const items: Array<{ type: "page"; page: number } | { type: "gap"; key: string }> = [];

  for (const page of sortedPages) {
    const previousItem = items.at(-1);
    const previousPage = previousItem?.type === "page" ? previousItem.page : undefined;

    if (previousPage && page - previousPage > 1) {
      items.push({ type: "gap", key: `${previousPage}-${page}` });
    }

    items.push({ type: "page", page });
  }

  return items;
}

export const metadata = buildJuiceMetadata({
  title: "Catálogo de rosas y arreglos florales",
  description:
    "Explora el catálogo de Dely Roses con rosas, ramos y arreglos florales organizados por categorías y etiquetas.",
  path: "/productos",
  keywords: ["catálogo floral", "comprar flores", "productos florales"],
});

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = getSearchQuery(resolvedSearchParams?.q);
  const requestedPage = getPageNumber(resolvedSearchParams?.page);
  const allProducts = getProducts();
  const products = searchProducts(query);
  const totalProducts = products.length;
  const pageCount = Math.max(1, Math.ceil(totalProducts / productsPerPage));
  const currentPage = Math.min(requestedPage, pageCount);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);
  const resultStart = totalProducts > 0 ? startIndex + 1 : 0;
  const resultEnd = Math.min(startIndex + paginatedProducts.length, totalProducts);
  const itemListName = query ? `Resultados para ${query}` : "Catálogo de Dely Roses";
  const categories = getCategories();
  const tags = getTags();
  const categoryCounts = new Map<string, number>();

  for (const product of allProducts) {
    for (const categorySlug of product.categorySlugs) {
      categoryCounts.set(categorySlug, (categoryCounts.get(categorySlug) || 0) + 1);
    }
  }

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
          ]),
          buildItemListJsonLd(itemListName, buildProductsUrl(query, currentPage), paginatedProducts),
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
          <form action="/productos" className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
            <label htmlFor="product-search" className="font-bold text-foreground">
              Buscar productos
            </label>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Filtra por flor, arreglo, categoría o presentación.</p>
            <input
              id="product-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Ej. rosas rojas"
              className="mt-4 w-full rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
            />
            <button type="submit" className="mt-3 w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-[#d98fa5]">
              Buscar
            </button>
            {query ? (
              <Link href="/productos" className="mt-3 inline-flex w-full justify-center text-sm font-bold text-accent hover:underline">
                Limpiar búsqueda
              </Link>
            ) : null}
          </form>

          <details className="group rounded-[1.5rem] border border-border bg-card p-5 shadow-sm" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground marker:text-accent">
              Categorías
              <span className="text-sm text-accent transition group-open:rotate-180" aria-hidden="true">
                ↓
              </span>
            </summary>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              <Link href="/productos" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#d98fa5]">
                Todas ({allProducts.length})
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categoria/${category.slug}`}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-primary"
                >
                  {category.name} ({categoryCounts.get(category.slug) || 0})
                </Link>
              ))}
            </div>
          </details>

          <details className="group rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground marker:text-accent">
              Etiquetas
              <span className="text-sm text-accent transition group-open:rotate-180" aria-hidden="true">
                ↓
              </span>
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.slug} className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
                  {tag.name}
                </span>
              ))}
            </div>
          </details>
        </aside>

        <div>
          <div className="mb-6 rounded-[1.25rem] border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-sm">
            <p>
              Mostrando {resultStart}-{resultEnd} de {totalProducts} producto{totalProducts === 1 ? "" : "s"}
              {query ? ` para “${query}”` : ""}.
            </p>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}

          {pageCount > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación de productos">
              {currentPage > 1 ? (
                <Link rel="prev" href={buildProductsUrl(query, currentPage - 1)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-accent transition hover:border-primary">
                  Anterior
                </Link>
              ) : (
                <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">Anterior</span>
              )}

              {getPaginationItems(currentPage, pageCount).map((item) =>
                item.type === "gap" ? (
                  <span key={item.key} className="px-2 text-sm font-bold text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Link
                    key={item.page}
                    href={buildProductsUrl(query, item.page)}
                    aria-current={item.page === currentPage ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      item.page === currentPage ? "bg-accent text-white" : "border border-border bg-card text-accent hover:border-primary"
                    }`}
                  >
                    {item.page}
                  </Link>
                ),
              )}

              {currentPage < pageCount ? (
                <Link rel="next" href={buildProductsUrl(query, currentPage + 1)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-accent transition hover:border-primary">
                  Siguiente
                </Link>
              ) : (
                <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">Siguiente</span>
              )}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
