import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { FloatingWhatsappButton } from "@/components/layout/floating-whatsapp-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ImageCacheRegistration } from "@/components/performance/image-cache-registration";
import { JsonLd } from "@/components/seo/json-ld";
import { getProducts } from "@/data/catalog";
import { buildStoreJsonLd, buildWebsiteJsonLd } from "@/lib/juice-seo";
import { brandKeywords, siteConfig } from "@/lib/site";

import "@/styles/index.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.shortName,
  title: {
    default: "Dely Roses | Rosas y arreglos florales",
    template: "%s | Dely Roses",
  },
  description: siteConfig.description,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  keywords: brandKeywords,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: "Dely Roses | Rosas y arreglos florales",
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dely Roses | Rosas y arreglos florales",
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF9F7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const productImageUrls = Array.from(new Set(getProducts().flatMap((product) => product.imageUrls))).slice(0, 80);

  return (
    <html lang="es" className={quicksand.variable}>
      <head>
        <link rel="preconnect" href={siteConfig.imageCdnUrl} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={siteConfig.imageCdnUrl} />
        <meta name="google-site-verification" content="760QMNts0dbwerXm9CW8y7guCOrcplktcrFTI2imaPk" />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <FloatingWhatsappButton whatsappUrl={siteConfig.whatsappUrl} />
        <ImageCacheRegistration imageCdnUrl={siteConfig.imageCdnUrl} productImageUrls={productImageUrls} />
        <JsonLd data={[buildStoreJsonLd(), buildWebsiteJsonLd()]} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
