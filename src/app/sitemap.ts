import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/data/catalog";
import { toAbsoluteUrl } from "@/lib/juice-seo";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["/", "/productos"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "daily",
    priority: route === "/" ? 1 : 0.9,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: `${siteConfig.url}/categoria/${category.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: toAbsoluteUrl(product.urlPath),
    lastModified,
    changeFrequency: "daily",
    priority: 0.7,
    images: product.imageUrls.map(toAbsoluteUrl),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
