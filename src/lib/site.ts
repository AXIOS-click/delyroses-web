const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const configuredWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export const siteConfig = {
  name: "Dely Roses",
  shortName: "Dely Roses",
  description:
    "Ecommerce de rosas frescas y arreglos florales delicados para regalos, aniversarios y momentos especiales.",
  url: configuredSiteUrl || "https://delyroses-ec.com",
  locale: "es",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  category: "Floristería online",
  whatsappUrl: configuredWhatsappNumber ? `https://wa.me/${configuredWhatsappNumber}` : undefined,
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
  { href: "/categoria/rosas", label: "Rosas" },
  { href: "/categoria/arreglos-florales", label: "Arreglos" },
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
