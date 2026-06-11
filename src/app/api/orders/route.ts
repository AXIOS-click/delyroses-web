import { NextResponse } from "next/server";

import { getProducts } from "@/data/catalog";
import type { CatalogProduct } from "@/data/catalog/types";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

type JsonRecord = Record<string, unknown>;

type ParsedCustomer = {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string | null;
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

function normalizeRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} es obligatorio.`);
  }

  return value.trim();
}

function normalizeOptionalString(value: unknown) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseCustomer(payload: JsonRecord): ParsedCustomer {
  const customer = payload.customer;

  if (!isRecord(customer)) {
    throw new Error("Los datos del cliente son obligatorios.");
  }

  const email = normalizeRequiredString(customer.email, "El email").toLowerCase();

  if (!email.includes("@")) {
    throw new Error("El email no tiene un formato válido.");
  }

  return {
    fullName: normalizeRequiredString(customer.fullName, "El nombre"),
    email,
    phone: normalizeRequiredString(customer.phone, "El teléfono"),
    addressLine: normalizeOptionalString(customer.addressLine),
    city: normalizeOptionalString(customer.city),
    province: normalizeOptionalString(customer.province),
    postalCode: normalizeOptionalString(customer.postalCode),
    notes: normalizeOptionalString(customer.notes),
  };
}

function parseItems(payload: JsonRecord): ParsedOrderItem[] {
  const rawItems = payload.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("El pedido debe tener al menos un producto.");
  }

  const productsById = new Map(getProducts().map((product) => [product.id, product]));
  const quantitiesByProductId = new Map<string, number>();

  for (const rawItem of rawItems) {
    if (!isRecord(rawItem)) {
      throw new Error("Cada item del carrito debe ser un objeto válido.");
    }

    const productId = normalizeRequiredString(rawItem.productId, "El producto");
    const quantity = rawItem.quantity;

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error(`La cantidad de ${productId} debe ser un entero entre 1 y 99.`);
    }

    const product = productsById.get(productId);

    if (!product) {
      throw new Error(`El producto ${productId} ya no está disponible en el catálogo.`);
    }

    quantitiesByProductId.set(productId, (quantitiesByProductId.get(productId) || 0) + quantity);
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

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;

    if (!isRecord(payload)) {
      return NextResponse.json({ error: "El cuerpo del pedido no es válido." }, { status: 400 });
    }

    const customer = parseCustomer(payload);
    const items = parseItems(payload);
    const subtotalAmount = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const shippingAmount = 0;
    const totalAmount = subtotalAmount + shippingAmount;
    const orderNumber = createOrderNumber();
    const supabase = createSupabaseAdminClient();

    const { data: customerRow, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          email: customer.email,
          full_name: customer.fullName,
          phone: customer.phone,
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (customerError || !customerRow) {
      return NextResponse.json({ error: customerError?.message || "No se pudo guardar el cliente." }, { status: 500 });
    }

    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
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
          city: customer.city,
          province: customer.province,
          postalCode: customer.postalCode,
        },
        notes: customer.notes,
      })
      .select("id, order_number")
      .single();

    if (orderError || !orderRow) {
      return NextResponse.json({ error: orderError?.message || "No se pudo guardar el pedido." }, { status: 500 });
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
        tags: product.tags,
      },
    }));

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems);

    if (orderItemsError) {
      await supabase.from("orders").delete().eq("id", orderRow.id);
      return NextResponse.json({ error: orderItemsError.message }, { status: 500 });
    }

    return NextResponse.json({
      orderId: orderRow.id,
      orderNumber: orderRow.order_number,
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
