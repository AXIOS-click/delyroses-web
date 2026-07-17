const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const configuredWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
const configuredImageCdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL?.replace(/\/$/, "");
const defaultWhatsappNumber = "593962965930";
const defaultImageCdnUrl = "https://cdn.delyroses-ec.com";

function withHttps(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export const siteConfig = {
  name: "Dely Roses",
  shortName: "Dely Roses",
  description:
    "Floristería en Quito especializada en arreglos florales, bouquets y flores a domicilio para cumpleaños, aniversarios, graduaciones, celebraciones y ocasiones especiales. Encuentra rosas, flores frescas, regalos y diseños personalizados con servicio de entrega en Quito. | Dely Roses",
  url: configuredSiteUrl || "https://delyroses-ec.com",
  imageCdnUrl: withHttps(configuredImageCdnUrl || defaultImageCdnUrl),
  locale: "es",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  category: "Floristería online",
  whatsappUrl: `https://wa.me/${configuredWhatsappNumber || defaultWhatsappNumber}`,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  socialLinks: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL
      ? { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL }
      : undefined,
    process.env.NEXT_PUBLIC_FACEBOOK_URL
      ? { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL }
      : undefined,
  ].filter((item): item is { label: string; href: string } => Boolean(item)),
};

export const navItems = [
  { href: "/productos", label: "Productos" },
  { href: "/categoria/rosa", label: "Rosas" },
  { href: "/categoria/orquidea", label: "Orquídeas" },
] as const;

export const brandKeywords = [
  "rosas",
  "arreglos florales",
  "floristería online",
  "ramos de rosas",
  "flores a domicilio",
  "regalos florales",
  "Dely Roses",
];
