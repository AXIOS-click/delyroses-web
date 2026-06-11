import sectorsJson from "./sectors.json";
import type { ShippingSector } from "./types";

type JsonObject = Record<string, unknown>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

function requiredSlug(record: JsonObject, key: string, context: string) {
  const slug = requiredString(record, key, context);

  if (!slugPattern.test(slug)) {
    throw new Error(`${context}.${key} debe usar formato slug, por ejemplo "sector-norte".`);
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

function requiredBoolean(record: JsonObject, key: string, context: string) {
  const value = record[key];

  if (typeof value !== "boolean") {
    throw new Error(`${context}.${key} debe ser true o false.`);
  }

  return value;
}

function parseShippingSector(value: unknown, index: number): ShippingSector {
  const context = `shippingSectors[${index}]`;
  const record = asObject(value, context);

  assertAllowedKeys(record, ["slug", "name", "description", "price", "enabled"], context);

  return {
    slug: requiredSlug(record, "slug", context),
    name: requiredString(record, "name", context),
    description: requiredString(record, "description", context),
    price: requiredNumber(record, "price", context),
    enabled: requiredBoolean(record, "enabled", context),
  };
}

function assertUniqueSlugs(items: Array<{ slug: string }>, context: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.slug)) throw new Error(`${context} tiene el slug duplicado "${item.slug}".`);
    seen.add(item.slug);
  }
}

export const shippingSectors = asArray(sectorsJson, "sectors.json").map(parseShippingSector);

assertUniqueSlugs(shippingSectors, "sectors.json");

export const enabledShippingSectors = shippingSectors.filter((sector) => sector.enabled);

const shippingSectorsBySlug = new Map(shippingSectors.map((sector) => [sector.slug, sector]));

export function getShippingSectors() {
  return shippingSectors;
}

export function getEnabledShippingSectors() {
  return enabledShippingSectors;
}

export function getShippingSectorBySlug(slug: string) {
  return shippingSectorsBySlug.get(slug);
}
