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
  follow?: boolean;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type WebPageJsonLdOptions = {
  name: string;
  description: string;
  path: string;
};

export const productReturnPolicyPath = "/politica-devoluciones";

export const productReturnPolicyText =
  "No se aceptan devoluciones por tratarse de flores frescas, perecederas y arreglos personalizados. El reembolso solo procede cuando Dely Roses verifica que el pedido no llegó al destino indicado por el cliente.";

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
  follow = !noIndex,
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
          follow,
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
    "@id": `${siteConfig.url}#florist`,
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
    "@id": `${siteConfig.url}#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/productos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildWebPageJsonLd({ name, description, path }: WebPageJsonLdOptions) {
  const url = toAbsoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: siteConfig.locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteConfig.url}#website`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Florist",
      "@id": `${siteConfig.url}#florist`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const breadcrumbName = items.map((item) => item.name).join(" > ");

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: breadcrumbName ? `Ruta de navegación: ${breadcrumbName}` : "Ruta de navegación",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: {
        "@type": "WebPage",
        "@id": toAbsoluteUrl(item.path),
        name: item.name,
      },
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
      name: `Listado de productos: ${name}`,
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
    category: product.category.name,
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
