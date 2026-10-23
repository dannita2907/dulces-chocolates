import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { BRAND_NAME } from "@/lib/constants";

export const metadata = { title: `Finalizar pedido | ${BRAND_NAME}` };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-cacao-800">Finalizar pedido</h1>
      <CheckoutForm />
    </div>
  );
}
