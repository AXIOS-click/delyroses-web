import { siteConfig } from "@/lib/site";

const productFolderPattern = /^(?:productos|products)\//i;

function normalizeRelativeImagePath(src: string) {
  return src.trim().replace(/\\/g, "/").replace(/^\/+/, "").replace(productFolderPattern, "");
}

export function toProductImageUrl(src?: string | null) {
  if (!src) return undefined;

  const value = src.trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;

  return `${siteConfig.imageCdnUrl}/${normalizeRelativeImagePath(value)}`;
}

export function toProductImageUrls(imageUrls: string[]) {
  return imageUrls.map(toProductImageUrl).filter((imageUrl): imageUrl is string => Boolean(imageUrl));
}
