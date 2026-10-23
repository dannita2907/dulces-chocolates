import { BRAND_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 bg-cacao-900 py-8 text-center text-sm text-cacao-200">
      <p className="font-serif text-lg text-gold-300">{BRAND_NAME}</p>
      <p className="mt-1">Chocolates artesanales hechos con dedicación.</p>
    </footer>
  );
}
