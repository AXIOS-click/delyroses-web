import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/data/catalog";
import { toAbsoluteUrl } from "@/lib/juice-seo";
import { siteConfig } from "@/lib/site";

function toXmlUrl(url: string) {
  return url.replace(/&(?!(?:amp|apos|gt|lt|quot);)/g, "&amp;");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["/", "/productos", "/politica-devoluciones"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: toXmlUrl(`${siteConfig.url}${route}`),
    lastModified,
    changeFrequency: route === "/productos" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/productos" ? 0.9 : 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: toXmlUrl(`${siteConfig.url}/categoria/${category.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: toXmlUrl(toAbsoluteUrl(product.urlPath)),
    lastModified,
    changeFrequency: "daily",
    priority: 0.7,
    images: product.imageUrls.map((imageUrl) => toXmlUrl(toAbsoluteUrl(imageUrl))),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
