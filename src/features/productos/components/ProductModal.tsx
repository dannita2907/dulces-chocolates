"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/features/carrito/cart-context";
import { formatCop } from "@/lib/format";
import { MAX_NOTES_LENGTH } from "@/lib/constants";
import type { ProductDTO } from "../types";
import { PriceNotice } from "./PriceNotice";
import { ProductImage } from "./ProductImage";

interface Props {
  product: ProductDTO;
  onClose: () => void;
}

const NOTE_SUGGESTIONS = "Ej: tipo de chocolate (negro, leche, blanco), colores, dedicatoria o solicitudes especiales.";

export function ProductModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const unitPrice = product.isQuoteOnly ? null : product.priceCop;
  const estimate = unitPrice === null ? null : unitPrice * quantity;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      unitPriceCop: unitPrice,
      imageUrl: product.imageUrl,
      quantity,
      notes: notes.trim(),
    });
    setAdded(true);
    window.setTimeout(onClose, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-cacao-900/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
      >
        <div className="grid sm:grid-cols-2">
          <ProductImage src={product.imageUrl} alt={product.name} className="h-56 w-full sm:h-full sm:min-h-[22rem]" />

          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-cacao-800">{product.name}</h2>
              <button type="button" onClick={onClose} aria-label="Cerrar" className="text-2xl text-cacao-500 hover:text-cacao-900">
                ×
              </button>
            </div>

            <p className="text-sm text-cacao-700">{product.description}</p>

            <div>
              <p className="text-2xl font-bold text-gold-600">
                {unitPrice === null ? "Cotizar" : formatCop(unitPrice)}
              </p>
              {product.priceNote && <p className="text-xs text-cacao-500">{product.priceNote}</p>}
            </div>

            <PriceNotice />

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Cantidad</span>
              <div className="flex items-center rounded-full border border-cacao-200 bg-white">
                <button
                  type="button"
                  className="h-9 w-9 text-lg"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="h-9 w-9 text-lg"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <label className="block text-sm font-medium">
              Comentarios y personalización
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={MAX_NOTES_LENGTH}
                rows={3}
                placeholder={NOTE_SUGGESTIONS}
                className="input mt-1"
              />
              <span className="text-xs text-cacao-400">
                {notes.length}/{MAX_NOTES_LENGTH}
              </span>
            </label>

            <button type="button" onClick={handleAdd} disabled={added} className="btn-primary">
              {added
                ? "✓ Agregado"
                : estimate === null
                  ? "Agregar al carrito"
                  : `Agregar · ${formatCop(estimate)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
