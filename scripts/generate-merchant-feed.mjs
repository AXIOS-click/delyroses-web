import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const rootDir = process.cwd();

loadEnvFiles();

const outputRoot = join(rootDir, "public", "merchant-center");
const merchantId = process.env.NEXT_PUBLIC_GOOGLE_CUSTOMER_REVIEWS_MERCHANT_ID || "5827107494";
const fallbackFeedToken = `dr-merchant-feed-${merchantId}`;
const hasPrivateFeedToken = Boolean(process.env.MERCHANT_CENTER_FEED_TOKEN?.trim());
const requiresPrivateFeedToken = process.env.VERCEL_ENV === "production" || process.env.MERCHANT_CENTER_REQUIRE_PRIVATE_TOKEN === "true";
const feedToken = sanitizeFeedToken(process.env.MERCHANT_CENTER_FEED_TOKEN || fallbackFeedToken);
const siteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL || "https://delyroses-ec.com");
const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";
const imageCdnUrl = normalizeOrigin(process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "https://cdn.delyroses-ec.com");

const feedHeaders = [
  "id",
  "title",
  "description",
  "price",
  "condition",
  "link",
  "availability",
  "image_link",
  "brand",
  "product_type",
  "identifier_exists",
  "adult",
  "shipping",
];

function loadEnvFiles() {
  const shellEnvKeys = new Set(Object.keys(process.env));

  for (const fileName of [".env", ".env.local"]) {
    const filePath = join(rootDir, fileName);
    if (!existsSync(filePath)) continue;

    const raw = readFileSync(filePath, "utf8");

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

      const separatorIndex = trimmed.indexOf("=");
      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();

      if (!key || shellEnvKeys.has(key)) continue;

      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

function sanitizeFeedToken(value) {
  const token = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (token.length < 12) {
    throw new Error("MERCHANT_CENTER_FEED_TOKEN debe tener al menos 12 caracteres seguros.");
  }

  return token.slice(0, 120);
}

function normalizeOrigin(value) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, "");
}

function normalizeProductImageUrl(src) {
  if (!src || typeof src !== "string") return "";

  const value = src.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const path = value.replace(/\\/g, "/").replace(/^\/+/, "").replace(/^(?:productos|products)\//i, "");
  return `${imageCdnUrl}/${path}`;
}

function escapeTsvValue(value) {
  return String(value ?? "")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function toMoney(value) {
  const numberValue = Number(value);
  const safeValue = Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
  return `${safeValue.toFixed(2)} ${currency}`;
}

function asArray(value, context) {
  if (!Array.isArray(value)) throw new Error(`${context} debe ser un array.`);
  return value;
}

function enabledShippingSummary(shippingSectors) {
  const enabledSectors = shippingSectors.filter((sector) => sector?.enabled && Number.isFinite(Number(sector.price)));
  const cheapestSector = enabledSectors.sort((first, second) => Number(first.price) - Number(second.price))[0];
  const shippingPrice = cheapestSector ? Number(cheapestSector.price) : 0;

  return `EC:Pichincha:Entrega local:${shippingPrice.toFixed(2)} ${currency}`;
}

function buildProductType(product, categoriesBySlug, tagsBySlug) {
  const categories = asArray(product.categorySlugs || [], `${product.id}.categorySlugs`)
    .map((slug) => categoriesBySlug.get(slug)?.name)
    .filter(Boolean);
  const tags = asArray(product.tagSlugs || [], `${product.id}.tagSlugs`)
    .map((slug) => tagsBySlug.get(slug)?.name)
    .filter(Boolean);

  return ["Flores", "Arreglos florales", ...categories.slice(0, 4), ...tags.slice(0, 2)].join(" > ");
}

export function buildMerchantCenterFeed({ products, categories, tags, shippingSectors }) {
  const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
  const tagsBySlug = new Map(tags.map((tag) => [tag.slug, tag]));
  const shipping = enabledShippingSummary(shippingSectors);

  const rows = products.map((product) => {
    const imageLinks = asArray(product.imageUrls || [], `${product.id}.imageUrls`).map(normalizeProductImageUrl).filter(Boolean);
    const productPath = `/producto/${product.slug}`;
    const productUrl = `${siteUrl}${productPath}`;
    const availability = Number(product.price) > 0 ? "in_stock" : "out_of_stock";

    return [
      product.id,
      product.name,
      product.description,
      toMoney(product.price),
      "new",
      productUrl,
      availability,
      imageLinks[0] || "",
      "Dely Roses",
      buildProductType(product, categoriesBySlug, tagsBySlug),
      "no",
      "no",
      shipping,
    ];
  });

  return [feedHeaders, ...rows].map((row) => row.map(escapeTsvValue).join("\t")).join("\n") + "\n";
}

async function readJson(relativePath) {
  const raw = await readFile(join(rootDir, relativePath), "utf8");
  return JSON.parse(raw);
}

async function main() {
  if (!hasPrivateFeedToken && requiresPrivateFeedToken) {
    throw new Error("MERCHANT_CENTER_FEED_TOKEN es obligatorio para generar el feed en producción.");
  }

  const [products, categories, tags, shippingSectors] = await Promise.all([
    readJson("src/data/catalog/products.json"),
    readJson("src/data/catalog/categories.json"),
    readJson("src/data/catalog/tags.json"),
    readJson("src/data/shipping/sectors.json"),
  ]);

  const feed = buildMerchantCenterFeed({
    products: asArray(products, "products.json"),
    categories: asArray(categories, "categories.json"),
    tags: asArray(tags, "tags.json"),
    shippingSectors: asArray(shippingSectors, "sectors.json"),
  });

  const outputDir = join(outputRoot, feedToken);
  const outputFile = join(outputDir, "products.txt");

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, feed, "utf8");

  if (!hasPrivateFeedToken) {
    console.warn("MERCHANT_CENTER_FEED_TOKEN no está configurado. Usa un token largo y privado en producción.");
  }

  console.log(`Merchant Center feed generado: ${siteUrl}/merchant-center/${feedToken}/products.txt`);
}

await main();
