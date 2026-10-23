"use client";

import Link from "next/link";
import { useCart } from "@/features/carrito/cart-context";
import { BRAND_NAME } from "@/lib/constants";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/30 bg-cacao-900/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl font-bold text-gold-300">
          🍫 {BRAND_NAME}
        </Link>
        <div className="flex items-center gap-5 text-sm text-cream">
          <Link href="/#catalogo" className="hover:text-gold-300">
            Catálogo
          </Link>
          <Link
            href="/carrito"
            className="relative rounded-full border border-gold-500/60 px-4 py-1.5 hover:bg-cacao-800"
            aria-label={`Carrito, ${itemCount} productos`}
          >
            🛒 Carrito
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-xs font-bold text-cacao-900">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
