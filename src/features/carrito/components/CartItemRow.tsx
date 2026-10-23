"use client";

import { useCart, type CartItem } from "../cart-context";
import { formatCop } from "@/lib/format";
import { MAX_NOTES_LENGTH } from "@/lib/constants";
import { ProductImage } from "@/features/productos/components/ProductImage";

export function CartItemRow({ item }: { item: CartItem }) {
  const { setQuantity, setNotes, removeItem } = useCart();
  const lineTotal = item.unitPriceCop === null ? null : item.unitPriceCop * item.quantity;

  return (
    <li className="flex gap-4 rounded-2xl border border-cacao-100 bg-white p-4">
      <ProductImage src={item.imageUrl} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-cacao-800">{item.name}</h3>
          <button type="button" onClick={() => removeItem(item.lineId)} className="text-sm text-red-700 hover:underline">
            Eliminar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-cacao-200">
            <button type="button" className="h-8 w-8" onClick={() => setQuantity(item.lineId, item.quantity - 1)} aria-label="Disminuir">
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
            <button type="button" className="h-8 w-8" onClick={() => setQuantity(item.lineId, item.quantity + 1)} aria-label="Aumentar">
              +
            </button>
          </div>
          <span className="text-sm text-cacao-600">
            {item.unitPriceCop === null ? "Por cotizar" : `${formatCop(item.unitPriceCop)} c/u`}
          </span>
          {lineTotal !== null && <span className="ml-auto font-bold text-gold-600">{formatCop(lineTotal)}</span>}
        </div>

        <textarea
          value={item.notes}
          onChange={(e) => setNotes(item.lineId, e.target.value)}
          maxLength={MAX_NOTES_LENGTH}
          rows={2}
          placeholder="Notas de este producto (chocolate, colores, dedicatoria...)"
          className="input"
          aria-label={`Notas para ${item.name}`}
        />
      </div>
    </li>
  );
}
