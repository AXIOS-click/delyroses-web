import categoriesJson from "./categories.json";
import productsJson from "./products.json";
import tagsJson from "./tags.json";
import type { CatalogCategory, CatalogProduct, CatalogProductJson, CatalogTag } from "./types";
import { toProductImageUrls } from "@/lib/images";

type JsonObject = Record<string, unknown>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const minimumProductsForPrimaryCategory = 4;
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

function optionalLastModified(record: JsonObject, context: string) {
  const value = optionalString(record, "lastModified", context);
  if (!value) return undefined;

  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${context}.lastModified debe usar una fecha válida en formato AAAA-MM-DD.`);
  }

  return value;
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
  assertAllowedKeys(record, ["slug", "name", "description", "seoTitle", "seoDescription", "guide", "lastModified"], context);

  const guide = record.guide === undefined
    ? undefined
    : asArray(record.guide, `${context}.guide`).map((value, sectionIndex) => {
        const sectionContext = `${context}.guide[${sectionIndex}]`;
        const section = asObject(value, sectionContext);
        assertAllowedKeys(section, ["heading", "body"], sectionContext);
        return {
          heading: requiredString(section, "heading", sectionContext),
          body: requiredString(section, "body", sectionContext),
        };
      });

  return {
    slug: requiredSlug(record, "slug", context),
    name: requiredString(record, "name", context),
    description: requiredString(record, "description", context),
    seoTitle: optionalString(record, "seoTitle", context),
    seoDescription: optionalString(record, "seoDescription", context),
    guide,
    lastModified: optionalLastModified(record, context),
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
    ["id", "slug", "name", "description", "price", "imageUrls", "categorySlugs", "filterCategorySlugs", "tagSlugs", "composition", "presentation", "importantNotes", "lastModified"],
    context,
  );

  const categorySlugs = requiredNonEmptyStringArray(record, "categorySlugs", context);
  const filterCategorySlugs = record.filterCategorySlugs === undefined
    ? []
    : requiredStringArray(record, "filterCategorySlugs", context);
  const tagSlugs = requiredStringArray(record, "tagSlugs", context);

  assertUniqueStrings([...categorySlugs, ...filterCategorySlugs], `${context} categorías`);
  assertUniqueStrings(tagSlugs, `${context}.tagSlugs`);

  return {
    id: requiredString(record, "id", context),
    slug: requiredSlug(record, "slug", context),
    name: requiredString(record, "name", context),
    description: requiredString(record, "description", context),
    price: requiredNumber(record, "price", context),
    imageUrls: requiredStringArray(record, "imageUrls", context),
    categorySlugs,
    filterCategorySlugs,
    tagSlugs,
    composition: requiredNonEmptyStringArray(record, "composition", context),
    presentation: requiredNonEmptyStringArray(record, "presentation", context),
    importantNotes: requiredStringArray(record, "importantNotes", context),
    lastModified: optionalLastModified(record, context),
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
  const imageUrls = toProductImageUrls(product.imageUrls);
  const categorySlugs = [...product.categorySlugs, ...product.filterCategorySlugs];
  const productCategories = categorySlugs.map((categorySlug) => {
    const category = categoriesBySlug.get(categorySlug);

    if (!category) {
      throw new Error(`products[${index}] referencia una categoría inexistente: ${categorySlug}.`);
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
    imageUrls,
    category: productCategories[0],
    categories: productCategories.slice(0, product.categorySlugs.length),
    tags: productTags,
    importantNotes: [deliveryNote, ...product.importantNotes, seasonalVariationNote],
    urlPath: `/producto/${product.slug}`,
    primaryImageUrl: imageUrls[0],
  };
});

assertUniqueSlugs(products, "products.json");

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const productSearchTextById = new Map(
  products.map((product) => [
    product.id,
    normalizeSearchValue(
      [
        product.name,
        product.description,
        product.slug,
        ...product.categories.map((category) => category.name),
        ...product.filterCategorySlugs.map((slug) => categoriesBySlug.get(slug)?.name),
        ...product.tags.map((tag) => tag.name),
        ...product.composition,
      ].join(" "),
    ),
  ]),
);

export const catalog = {
  categories,
  tags,
  products,
};

export function getCategories() {
  return categories;
}

export function isPrimaryCategory(category: CatalogCategory) {
  return Boolean(category.guide?.length) && getProductsByCategory(category.slug).length >= minimumProductsForPrimaryCategory;
}

export function getPrimaryCategories() {
  return categories.filter(isPrimaryCategory);
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

export function searchProducts(query: string) {
  const terms = normalizeSearchValue(query).split(/\s+/).filter(Boolean);

  if (terms.length === 0) return products;

  return products.filter((product) => {
    const searchText = productSearchTextById.get(product.id) || "";
    return terms.every((term) => searchText.includes(term));
  });
}

export function getFeaturedProducts(limit = 4) {
  return products.slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlugs.includes(categorySlug) || product.filterCategorySlugs.includes(categorySlug));
}

export function getFixedInternalProducts(product: CatalogProduct, limit = 8) {
  return products.filter((candidate) => candidate.id !== product.id).slice(0, limit);
}
