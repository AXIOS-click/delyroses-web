import type { MetadataRoute } from "next";

import { getFeaturedProducts, getPrimaryCategories, getProducts, getProductsByCategory } from "@/data/catalog";
import { toAbsoluteUrl } from "@/lib/juice-seo";
import { siteConfig } from "@/lib/site";

function toXmlUrl(url: string) {
  return url.replace(/&(?!(?:amp|apos|gt|lt|quot);)/g, "&amp;");
}

function latestContentDate(...dates: (string | undefined)[]) {
  return dates.reduce<string | undefined>((latest, date) => date && (!latest || date > latest) ? date : latest, undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getPrimaryCategories();
  const products = getProducts();
  const categoryDates = categories.map((category) => category.lastModified);
  // Update these dates when the corresponding page copy changes significantly.
  const staticRoutes = [
    ["/", latestContentDate("2026-11-18", ...categoryDates, ...getFeaturedProducts().map((product) => product.lastModified))],
    ["/productos", latestContentDate("2026-11-18", ...categoryDates, ...products.map((product) => product.lastModified))],
    ["/politica-devoluciones", "2026-07-18"],
    ["/politica-privacidad", "2026-07-18"],
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(([route, lastModified]) => ({
    url: toXmlUrl(`${siteConfig.url}${route}`),
    lastModified,
    changeFrequency: route === "/productos" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/productos" ? 0.9 : 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: toXmlUrl(`${siteConfig.url}/categoria/${category.slug}`),
    lastModified: latestContentDate(category.lastModified, ...getProductsByCategory(category.slug).map((product) => product.lastModified)),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: toXmlUrl(toAbsoluteUrl(product.urlPath)),
    lastModified: product.lastModified,
    changeFrequency: "daily",
    priority: 0.7,
    images: product.imageUrls.map((imageUrl) => toXmlUrl(toAbsoluteUrl(imageUrl))),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
