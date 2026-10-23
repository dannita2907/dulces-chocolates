"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/carrito/cart-context";
import { formatCop } from "@/lib/format";

const HIDDEN_ON = ["/carrito", "/checkout", "/admin"];

export function FloatingCartButton() {
  const pathname = usePathname();
  const { itemCount, subtotalCop } = useCart();

  if (itemCount === 0 || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <Link
      href="/carrito"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-cacao-900 shadow-xl transition hover:bg-gold-400"
    >
      <span>🛒 {itemCount}</span>
      {subtotalCop > 0 && <span>{formatCop(subtotalCop)}</span>}
    </Link>
  );
}
