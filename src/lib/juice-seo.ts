import type { Metadata } from "next";

import type { CatalogProduct } from "@/data/catalog/types";
import { brandKeywords, siteConfig } from "@/lib/site";

type JuiceImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type JuiceMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  images?: JuiceImage[];
  noIndex?: boolean;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteConfig.url}${normalizePath(pathOrUrl)}`;
}

export function buildJuiceMetadata({
  title,
  description,
  path,
  keywords = [],
  images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  noIndex = false,
}: JuiceMetadataOptions): Metadata {
  const canonical = normalizePath(path);
  const absoluteUrl = toAbsoluteUrl(canonical);
  const openGraphImages = images.map((image) => ({
    url: toAbsoluteUrl(image.url),
    width: image.width ?? 1200,
    height: image.height ?? 630,
    alt: image.alt ?? title,
  }));

  return {
    title,
    description,
    keywords: [...brandKeywords, ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: absoluteUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraphImages.map((image) => image.url),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-video-preview": -1,
            "max-snippet": -1,
          },
        },
  };
}

export function buildStoreJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    sameAs: siteConfig.socialLinks.map((item) => item.href),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/productos?buscar={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildItemListJsonLd(name: string, path: string, products: CatalogProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: toAbsoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toAbsoluteUrl(product.urlPath),
        name: product.name,
      })),
    },
  };
}

export function buildProductJsonLd(product: CatalogProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrls.map(toAbsoluteUrl),
    category: product.category.name,
    keywords: product.tags.map((tag) => tag.name).join(", "),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: siteConfig.currency,
      availability: "https://schema.org/InStock",
      url: toAbsoluteUrl(product.urlPath),
    },
  };
}
