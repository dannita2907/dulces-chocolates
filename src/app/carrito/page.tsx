import { CartView } from "@/features/carrito/components/CartView";
import { BRAND_NAME } from "@/lib/constants";

export const metadata = { title: `Carrito | ${BRAND_NAME}` };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-cacao-800">Tu carrito</h1>
      <CartView />
    </div>
  );
}
