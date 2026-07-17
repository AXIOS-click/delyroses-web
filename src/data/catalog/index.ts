import categoriesJson from "./categories.json";
import productsJson from "./products.json";
import tagsJson from "./tags.json";
import type { CatalogCategory, CatalogProduct, CatalogProductJson, CatalogTag } from "./types";

type JsonObject = Record<string, unknown>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const deliveryNote = "Envío. El valor del producto no incluye el servicio de entrega. El costo se calcula según la distancia.";
const seasonalVariationNote =
  "Variaciones estacionales. La composición puede presentar pequeños cambios según la disponibilidad de cada variedad. Toda sustitución se realizará con flores de igual o mayor valor, conservando la paleta de colores, el volumen y la estética del diseño.";

function asArray(value: unknown, context: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${context} debe ser un array.`);
  return value;
}

function asObject(value: unknown, context: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${context} debe ser un objeto.`);
  }

  return value as JsonObject;
}

function assertAllowedKeys(record: JsonObject, allowedKeys: string[], context: string) {
  const unknownKeys = Object.keys(record).filter((key) => !allowedKeys.includes(key));

  if (unknownKeys.length > 0) {
    throw new Error(`${context} tiene campos no permitidos: ${unknownKeys.join(", ")}.`);
  }
}

function requiredString(record: JsonObject, key: string, context: string) {
  const value = record[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context}.${key} debe ser un string no vacío.`);
  }

  return value.trim();
}

function optionalString(record: JsonObject, key: string, context: string) {
  const value = record[key];

  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context}.${key} debe ser un string no vacío cuando exista.`);
  }

  return value.trim();
}

function requiredSlug(record: JsonObject, key: string, context: string) {
  const slug = requiredString(record, key, context);

  if (!slugPattern.test(slug)) {
    throw new Error(`${context}.${key} debe usar formato slug, por ejemplo "arreglos-florales".`);
  }

  return slug;
}

function requiredNumber(record: JsonObject, key: string, context: string) {
  const value = record[key];

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`${context}.${key} debe ser un número mayor o igual a 0.`);
  }

  return value;
}

function requiredStringArray(record: JsonObject, key: string, context: string) {
  const value = record[key];

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
    throw new Error(`${context}.${key} debe ser un array de strings no vacíos.`);
  }

  return value.map((item) => item.trim());
}

function requiredNonEmptyStringArray(record: JsonObject, key: string, context: string) {
  const value = requiredStringArray(record, key, context);

  if (value.length === 0) {
    throw new Error(`${context}.${key} debe tener al menos un valor.`);
  }

  return value;
}

function assertUniqueStrings(items: string[], context: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item)) throw new Error(`${context} tiene el valor duplicado "${item}".`);
    seen.add(item);
  }
}

function assertUniqueSlugs(items: Array<{ slug: string }>, context: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.slug)) throw new Error(`${context} tiene el slug duplicado "${item.slug}".`);
    seen.add(item.slug);
  }
}

function parseCategory(value: unknown, index: number): CatalogCategory {
  const context = `categories[${index}]`;
  const record = asObject(value, context);
  assertAllowedKeys(record, ["slug", "name", "description", "seoTitle", "seoDescription"], context);

  return {
    slug: requiredSlug(record, "slug", context),
    name: requiredString(record, "name", context),
    description: requiredString(record, "description", context),
    seoTitle: optionalString(record, "seoTitle", context),
    seoDescription: optionalString(record, "seoDescription", context),
  };
}

function parseTag(value: unknown, index: number): CatalogTag {
  const context = `tags[${index}]`;
  const record = asObject(value, context);
  assertAllowedKeys(record, ["slug", "name", "description"], context);

  return {
    slug: requiredSlug(record, "slug", context),
    name: requiredString(record, "name", context),
    description: optionalString(record, "description", context),
  };
}

function parseProduct(value: unknown, index: number): CatalogProductJson {
  const context = `products[${index}]`;
  const record = asObject(value, context);
  assertAllowedKeys(
    record,
    ["id", "slug", "name", "description", "price", "imageUrls", "categorySlugs", "tagSlugs", "composition", "presentation", "importantNotes"],
    context,
  );

  const categorySlugs = requiredNonEmptyStringArray(record, "categorySlugs", context);
  const tagSlugs = requiredStringArray(record, "tagSlugs", context);

  assertUniqueStrings(categorySlugs, `${context}.categorySlugs`);
  assertUniqueStrings(tagSlugs, `${context}.tagSlugs`);

  return {
    id: requiredString(record, "id", context),
    slug: requiredSlug(record, "slug", context),
    name: requiredString(record, "name", context),
    description: requiredString(record, "description", context),
    price: requiredNumber(record, "price", context),
    imageUrls: requiredStringArray(record, "imageUrls", context),
    categorySlugs,
    tagSlugs,
    composition: requiredNonEmptyStringArray(record, "composition", context),
    presentation: requiredNonEmptyStringArray(record, "presentation", context),
    importantNotes: requiredStringArray(record, "importantNotes", context),
  };
}

export const categories = asArray(categoriesJson, "categories.json").map(parseCategory);
export const tags = asArray(tagsJson, "tags.json").map(parseTag);

assertUniqueSlugs(categories, "categories.json");
assertUniqueSlugs(tags, "tags.json");

const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
const tagsBySlug = new Map(tags.map((tag) => [tag.slug, tag]));

export const products: CatalogProduct[] = asArray(productsJson, "products.json").map((value, index) => {
  const product = parseProduct(value, index);
  const productCategories = product.categorySlugs.map((categorySlug) => {
    const category = categoriesBySlug.get(categorySlug);

    if (!category) {
      throw new Error(`products[${index}].categorySlugs referencia una categoría inexistente: ${categorySlug}.`);
    }

    return category;
  });

  const productTags = product.tagSlugs.map((tagSlug) => {
    const tag = tagsBySlug.get(tagSlug);
    if (!tag) throw new Error(`products[${index}].tagSlugs referencia una etiqueta inexistente: ${tagSlug}.`);
    return tag;
  });

  return {
    ...product,
    category: productCategories[0],
    categories: productCategories,
    tags: productTags,
    importantNotes: [deliveryNote, ...product.importantNotes, seasonalVariationNote],
    urlPath: `/producto/${product.slug}`,
    primaryImageUrl: product.imageUrls[0],
  };
});

assertUniqueSlugs(products, "products.json");

export const catalog = {
  categories,
  tags,
  products,
};

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categoriesBySlug.get(slug);
}

export function getTags() {
  return tags;
}

export function getProducts() {
  return products;
}

export function getFeaturedProducts(limit = 4) {
  return products.slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlugs.includes(categorySlug));
}

export function getRelatedProducts(product: CatalogProduct, limit = 4) {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const sharedCategories = candidate.categorySlugs.filter((categorySlug) => product.categorySlugs.includes(categorySlug)).length;
      const sharedTags = candidate.tagSlugs.filter((tagSlug) => product.tagSlugs.includes(tagSlug)).length;

      return {
        product: candidate,
        score: sharedCategories * 3 + sharedTags,
      };
    })
    .sort((first, second) => second.score - first.score || first.product.name.localeCompare(second.product.name))
    .slice(0, limit)
    .map((item) => item.product);
}
