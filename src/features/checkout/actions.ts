"use server";

import { prisma } from "@/lib/prisma";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { checkoutSchema, type CreateOrderResult } from "./schema";

/**
 * Crea el pedido en MySQL. Nunca confía en precios ni nombres del cliente:
 * los recalcula desde la base de datos.
 */
export async function createOrder(payload: unknown): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const { name, phone, address, notes, items } = parsed.data;

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });
  const byId = new Map(products.map((p) => [p.id, p]));

  if (byId.size !== productIds.length) {
    return { ok: false, error: "Algunos productos ya no están disponibles. Actualiza tu carrito." };
  }

  const lines = items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) throw new Error("Producto inesperadamente ausente");
    return {
      productId: product.id,
      productName: product.name,
      unitPriceCop: product.isQuoteOnly ? null : product.priceCop,
      quantity: item.quantity,
      notes: item.notes?.trim() || null,
    };
  });

  const totalCop = lines.reduce((sum, l) => sum + (l.unitPriceCop ?? 0) * l.quantity, 0);
  const hasQuoteItems = lines.some((l) => l.unitPriceCop === null);

  try {
    const order = await prisma.order.create({
      data: {
        customerName: name,
        phone,
        address,
        notes: notes?.trim() || null,
        totalCop,
        hasQuoteItems,
        items: { create: lines },
      },
    });

    const message = buildOrderMessage({
      orderId: order.id,
      customerName: name,
      phone,
      address,
      notes: order.notes,
      items: lines,
      totalCop,
      hasQuoteItems,
    });

    return { ok: true, orderId: order.id, whatsappUrl: buildWhatsAppUrl(WHATSAPP_NUMBER, message) };
  } catch (error) {
    console.error("createOrder failed", error);
    return { ok: false, error: "No pudimos guardar tu pedido. Intenta de nuevo en unos minutos." };
  }
}
