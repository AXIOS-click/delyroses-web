import { NextResponse } from "next/server";

import { getProducts } from "@/data/catalog";
import type { CatalogProduct } from "@/data/catalog/types";
import { getShippingSectorBySlug } from "@/data/shipping";
import type { ShippingSector } from "@/data/shipping/types";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

type JsonRecord = Record<string, unknown>;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const MAX_REQUEST_BODY_BYTES = 20_000;
const MAX_ORDER_ITEMS = 50;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_MAX_ENTRIES = 1_000;
const LOCAL_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];
const orderRateLimit = new Map<string, RateLimitEntry>();

type ParsedCustomer = {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string | null;
  shippingSector: ShippingSector;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  notes: string | null;
};

type ParsedOrderItem = {
  product: CatalogProduct;
  quantity: number;
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeOrigin(value: string | null | undefined) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getOriginVariants(origin: string) {
  const variants = new Set([origin]);

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    const port = url.port ? `:${url.port}` : "";

    if (hostname.startsWith("www.")) {
      variants.add(`${url.protocol}//${hostname.slice(4)}${port}`);
    } else if (hostname.includes(".") && !hostname.endsWith(".localhost")) {
      variants.add(`${url.protocol}//www.${hostname}${port}`);
    }
  } catch {
    return variants;
  }

  return variants;
}

function normalizeOriginList(value: string | null | undefined) {
  if (!value) return [];

  return value
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter((origin): origin is string => Boolean(origin));
}

function addAllowedOrigin(origins: Set<string>, value: string | null | undefined) {
  const origin = normalizeOrigin(value);
  if (!origin) return;

  for (const variant of getOriginVariants(origin)) {
    origins.add(variant);
  }
}

function getAllowedOrigins() {
  const origins = new Set<string>();

  for (const origin of [
    siteConfig.url,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
    ...LOCAL_ALLOWED_ORIGINS,
    ...normalizeOriginList(process.env.ORDER_ALLOWED_ORIGINS),
  ]) {
    addAllowedOrigin(origins, origin);
  }

  return origins;
}

function hasTrustedOrigin(request: Request) {
  const allowedOrigins = getAllowedOrigins();
  const origin = normalizeOrigin(request.headers.get("origin"));

  if (origin) return allowedOrigins.has(origin);

  const referer = normalizeOrigin(request.headers.get("referer"));
  if (referer) return allowedOrigins.has(referer);

  return process.env.NODE_ENV !== "production";
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "unknown";
}

function isRequestTooLarge(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;

  const parsedLength = Number(contentLength);
  return Number.isFinite(parsedLength) && parsedLength > MAX_REQUEST_BODY_BYTES;
}

function isRateLimited(key: string) {
  const now = Date.now();

  if (orderRateLimit.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [entryKey, entry] of orderRateLimit.entries()) {
      if (entry.resetAt <= now) orderRateLimit.delete(entryKey);
    }
  }

  const entry = orderRateLimit.get(key);

  if (!entry || entry.resetAt <= now) {
    orderRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalizeRequiredString(value: unknown, fieldName: string, maxLength = 255) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} es obligatorio.`);
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} no puede superar ${maxLength} caracteres.`);
  }

  return trimmed;
}

function normalizeOptionalString(value: unknown, fieldName: string, maxLength = 255) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    throw new Error(`${fieldName} debe ser texto.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} no puede superar ${maxLength} caracteres.`);
  }

  return trimmed.length > 0 ? trimmed : null;
}

function parseCustomer(payload: JsonRecord): ParsedCustomer {
  const customer = payload.customer;

  if (!isRecord(customer)) {
    throw new Error("Los datos del cliente son obligatorios.");
  }

  const email = normalizeRequiredString(customer.email, "El email", 254).toLowerCase();
  const shippingSectorSlug = normalizeRequiredString(customer.shippingSectorSlug, "El sector de entrega", 80);
  const shippingSector = getShippingSectorBySlug(shippingSectorSlug);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El email no tiene un formato válido.");
  }

  if (!shippingSector || !shippingSector.enabled) {
    throw new Error("El sector de entrega seleccionado no está disponible.");
  }

  return {
    fullName: normalizeRequiredString(customer.fullName, "El nombre", 120),
    email,
    phone: normalizeRequiredString(customer.phone, "El teléfono", 40),
    addressLine: normalizeOptionalString(customer.addressLine, "La dirección", 240),
    shippingSector,
    city: normalizeOptionalString(customer.city, "La ciudad", 80),
    province: normalizeOptionalString(customer.province, "La provincia", 80),
    postalCode: normalizeOptionalString(customer.postalCode, "El código postal", 20),
    notes: normalizeOptionalString(customer.notes, "Las notas", 500),
  };
}

function parseItems(payload: JsonRecord): ParsedOrderItem[] {
  const rawItems = payload.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("El pedido debe tener al menos un producto.");
  }

  if (rawItems.length > MAX_ORDER_ITEMS) {
    throw new Error(`El pedido no puede tener más de ${MAX_ORDER_ITEMS} items.`);
  }

  const productsById = new Map(getProducts().map((product) => [product.id, product]));
  const quantitiesByProductId = new Map<string, number>();

  for (const rawItem of rawItems) {
    if (!isRecord(rawItem)) {
      throw new Error("Cada item del carrito debe ser un objeto válido.");
    }

    const productId = normalizeRequiredString(rawItem.productId, "El producto", 100);
    const quantity = rawItem.quantity;

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error(`La cantidad de ${productId} debe ser un entero entre 1 y 99.`);
    }

    const product = productsById.get(productId);

    if (!product) {
      throw new Error(`El producto ${productId} ya no está disponible en el catálogo.`);
    }

    const nextQuantity = (quantitiesByProductId.get(productId) || 0) + quantity;

    if (nextQuantity > 99) {
      throw new Error(`La cantidad total de ${productId} debe ser un entero entre 1 y 99.`);
    }

    quantitiesByProductId.set(productId, nextQuantity);
  }

  return Array.from(quantitiesByProductId.entries()).map(([productId, quantity]) => {
    const product = productsById.get(productId);

    if (!product) {
      throw new Error(`El producto ${productId} ya no está disponible en el catálogo.`);
    }

    return { product, quantity };
  });
}

function createOrderNumber() {
  return `DR-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

function createConfirmationToken() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
}

export async function POST(request: Request) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }

    if (isRequestTooLarge(request)) {
      return NextResponse.json({ error: "El cuerpo del pedido es demasiado grande." }, { status: 413 });
    }

    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json({ error: "Demasiados intentos. Intenta nuevamente en un minuto." }, { status: 429 });
    }

    const payload = (await request.json()) as unknown;

    if (!isRecord(payload)) {
      return NextResponse.json({ error: "El cuerpo del pedido no es válido." }, { status: 400 });
    }

    const customer = parseCustomer(payload);
    const items = parseItems(payload);
    const subtotalAmount = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const shippingAmount = customer.shippingSector.price;
    const totalAmount = subtotalAmount + shippingAmount;
    const orderNumber = createOrderNumber();
    const confirmationToken = createConfirmationToken();
    const supabase = createSupabaseAdminClient();

    const { data: insertedCustomerRow, error: customerInsertError } = await supabase
      .from("customers")
      .insert({
        email: customer.email,
        full_name: customer.fullName,
        phone: customer.phone,
      })
      .select("id")
      .single();

    let customerRow = insertedCustomerRow;

    if (customerInsertError) {
      if (customerInsertError.code !== "23505") {
        return NextResponse.json({ error: "No se pudo guardar el cliente." }, { status: 500 });
      }

      const { data: existingCustomerRow, error: customerSelectError } = await supabase
        .from("customers")
        .select("id")
        .eq("email", customer.email)
        .single();

      if (customerSelectError || !existingCustomerRow) {
        return NextResponse.json({ error: "No se pudo guardar el cliente." }, { status: 500 });
      }

      customerRow = existingCustomerRow;
    }

    if (!customerRow) {
      return NextResponse.json({ error: "No se pudo guardar el cliente." }, { status: 500 });
    }

    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        confirmation_token: confirmationToken,
        customer_id: customerRow.id,
        customer_email: customer.email,
        customer_name: customer.fullName,
        customer_phone: customer.phone,
        subtotal_amount: subtotalAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        currency: siteConfig.currency,
        delivery_address: {
          addressLine: customer.addressLine,
          shippingSector: {
            slug: customer.shippingSector.slug,
            name: customer.shippingSector.name,
            description: customer.shippingSector.description,
            price: customer.shippingSector.price,
          },
          city: customer.city,
          province: customer.province,
          postalCode: customer.postalCode,
        },
        notes: customer.notes,
      })
      .select("id, order_number, confirmation_token")
      .single();

    if (orderError || !orderRow) {
      return NextResponse.json({ error: "No se pudo guardar el pedido." }, { status: 500 });
    }

    const orderItems = items.map(({ product, quantity }) => ({
      order_id: orderRow.id,
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.name,
      product_description: product.description,
      product_category_slug: product.category.slug,
      product_category_name: product.category.name,
      product_image_url: product.primaryImageUrl || null,
      unit_price: product.price,
      quantity,
      product_snapshot: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrls: product.imageUrls,
        category: product.category,
        categories: product.categories,
        tags: product.tags,
        composition: product.composition,
        presentation: product.presentation,
        importantNotes: product.importantNotes,
      },
    }));

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems);

    if (orderItemsError) {
      await supabase.from("orders").delete().eq("id", orderRow.id);
      return NextResponse.json({ error: "No se pudieron guardar los productos del pedido." }, { status: 500 });
    }

    return NextResponse.json({
      orderId: orderRow.id,
      orderNumber: orderRow.order_number,
      confirmationToken: orderRow.confirmation_token,
      subtotalAmount,
      shippingAmount,
      totalAmount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el pedido.";
    const status = message.startsWith("Falta SUPABASE") ? 500 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
