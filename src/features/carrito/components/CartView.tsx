"use client";

import Link from "next/link";
import { useCart } from "../cart-context";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { PriceNotice } from "@/features/productos/components/PriceNotice";

export function CartView() {
  const { items, hydrated, clear } = useCart();

  if (!hydrated) return <p className="py-20 text-center text-cacao-500">Cargando carrito…</p>;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-lg text-cacao-600">Tu carrito está vacío.</p>
        <Link href="/#catalogo" className="btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        <PriceNotice />
        <ul className="space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.lineId} item={item} />
          ))}
        </ul>
        <button type="button" onClick={clear} className="text-sm text-cacao-500 hover:underline">
          Vaciar carrito
        </button>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <CartSummary />
        <Link href="/checkout" className="btn-primary w-full">
          Continuar con el pedido
        </Link>
      </aside>
    </div>
  );
}
