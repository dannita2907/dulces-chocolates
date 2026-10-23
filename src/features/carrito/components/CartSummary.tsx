"use client";

import { useCart } from "../cart-context";
import { formatCop } from "@/lib/format";

export function CartSummary() {
  const { subtotalCop, hasQuoteItems, itemCount } = useCart();

  return (
    <dl className="space-y-2 rounded-2xl border border-cacao-100 bg-white p-5 text-sm">
      <div className="flex justify-between">
        <dt>Productos</dt>
        <dd>{itemCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{formatCop(subtotalCop)}</dd>
      </div>
      <div className="flex justify-between border-t border-cacao-100 pt-2 text-base font-bold text-cacao-800">
        <dt>Total estimado</dt>
        <dd>{formatCop(subtotalCop)}</dd>
      </div>
      {hasQuoteItems && (
        <p className="text-xs text-cacao-500">Hay ítems por cotizar que no están incluidos en el total.</p>
      )}
      <p className="text-xs text-cacao-500">El envío y los ajustes por personalización se confirman por WhatsApp.</p>
    </dl>
  );
}
