import type { Metadata } from "next";

import { getEnabledShippingSectors } from "@/data/shipping";
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

export const productEditorialRating = {
  value: "5.0",
  bestRating: "5",
  worstRating: "1",
  reviewCount: 1,
} as const;

export const productReturnPolicyPath = "/politica-devoluciones";

export const productReturnPolicyText =
  "No se aceptan devoluciones por tratarse de flores frescas, perecederas y arreglos personalizados. El reembolso solo procede cuando Dely Roses verifica que el pedido no llegó al destino indicado por el cliente.";

export function buildProductReviewText(product: CatalogProduct) {
  const composition = product.composition.slice(0, 5).join(", ");
  const extraComposition = product.composition.length > 5 ? " y flores de complemento" : "";
  const presentation = product.presentation[0]?.replace(/\.$/, "");

  return `El equipo floral de ${siteConfig.name} recomienda ${product.name} por su composición de ${composition}${extraComposition}. ${
    presentation ? `Se entrega con ${presentation.toLowerCase()}. ` : ""
  }Diseño preparado para compra y entrega local en ${siteConfig.city}.`;
}

function buildProductShippingDetailsJsonLd() {
  return getEnabledShippingSectors().map((sector) => ({
    "@type": "OfferShippingDetails",
    name: sector.name,
    description: sector.description,
    shippingLabel: sector.name,
    shippingRate: {
      "@type": "MonetaryAmount",
      value: sector.price.toFixed(2),
      currency: siteConfig.currency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: siteConfig.countryCode,
      addressRegion: siteConfig.region,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
    },
  }));
}

function buildMerchantReturnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    name: "Política de devolución para flores frescas y arreglos personalizados",
    description: productReturnPolicyText,
    url: toAbsoluteUrl(productReturnPolicyPath),
    applicableCountry: siteConfig.countryCode,
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  };
}

function buildProductReviewJsonLd(product: CatalogProduct) {
  return {
    "@type": "Review",
    name: `Reseña editorial de ${product.name}`,
    reviewBody: buildProductReviewText(product),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: productEditorialRating.value,
      bestRating: productEditorialRating.bestRating,
      worstRating: productEditorialRating.worstRating,
    },
  };
}

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
    areaServed: {
      "@type": "City",
      name: siteConfig.city,
      containedInPlace: {
        "@type": "Country",
        name: siteConfig.countryName,
      },
    },
    currenciesAccepted: siteConfig.currency,
    sameAs: siteConfig.socialLinks.map((item) => item.href),
    contactPoint: siteConfig.whatsappUrl
      ? {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: "es",
          url: siteConfig.whatsappUrl,
        }
      : undefined,
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
  const productUrl = toAbsoluteUrl(product.urlPath);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: product.description,
    url: productUrl,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    image: product.imageUrls.map(toAbsoluteUrl),
    category: product.categories.map((category) => category.name).join(", "),
    keywords: [...product.categories.map((category) => category.name), ...product.tags.map((tag) => tag.name)].join(", "),
    material: product.composition,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Composición floral",
        value: product.composition.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Presentación",
        value: product.presentation.join(" "),
      },
      {
        "@type": "PropertyValue",
        name: "Área de entrega",
        value: `${siteConfig.city}, ${siteConfig.countryName}`,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: productEditorialRating.value,
      bestRating: productEditorialRating.bestRating,
      worstRating: productEditorialRating.worstRating,
      ratingCount: productEditorialRating.reviewCount,
      reviewCount: productEditorialRating.reviewCount,
    },
    review: buildProductReviewJsonLd(product),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: siteConfig.currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: productUrl,
      seller: {
        "@type": "Florist",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      areaServed: {
        "@type": "City",
        name: siteConfig.city,
        containedInPlace: {
          "@type": "Country",
          name: siteConfig.countryName,
        },
      },
      hasMerchantReturnPolicy: buildMerchantReturnPolicyJsonLd(),
      shippingDetails: buildProductShippingDetailsJsonLd(),
    },
  };
}
