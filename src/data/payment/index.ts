import bankAccountsJson from "./bank-accounts.json";
import type { BankAccount } from "./types";

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
    throw new Error(`${context}.${key} debe usar formato slug, por ejemplo "banco-pichincha".`);
  }

  return slug;
}

function requiredBoolean(record: JsonObject, key: string, context: string) {
  const value = record[key];

  if (typeof value !== "boolean") {
    throw new Error(`${context}.${key} debe ser true o false.`);
  }

  return value;
}

function parseBankAccount(value: unknown, index: number): BankAccount {
  const context = `bankAccounts[${index}]`;
  const record = asObject(value, context);

  assertAllowedKeys(
    record,
    [
      "slug",
      "bankName",
      "displayName",
      "accountHolder",
      "accountType",
      "accountNumber",
      "documentId",
      "email",
      "logoUrl",
      "instructions",
      "enabled",
    ],
    context,
  );

  return {
    slug: requiredSlug(record, "slug", context),
    bankName: requiredString(record, "bankName", context),
    displayName: requiredString(record, "displayName", context),
    accountHolder: requiredString(record, "accountHolder", context),
    accountType: requiredString(record, "accountType", context),
    accountNumber: requiredString(record, "accountNumber", context),
    documentId: requiredString(record, "documentId", context),
    email: requiredString(record, "email", context),
    logoUrl: requiredString(record, "logoUrl", context),
    instructions: optionalString(record, "instructions", context),
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

export const bankAccounts = asArray(bankAccountsJson, "bank-accounts.json").map(parseBankAccount);

assertUniqueSlugs(bankAccounts, "bank-accounts.json");

export const enabledBankAccounts = bankAccounts.filter((account) => account.enabled);

export function getBankAccounts() {
  return bankAccounts;
}

export function getEnabledBankAccounts() {
  return enabledBankAccounts;
}
