import { formatCop } from "@/lib/format";
import type { ProductDTO } from "../types";
import { ProductImage } from "./ProductImage";

interface Props {
  product: ProductDTO;
  onSelect: (product: ProductDTO) => void;
}

export function ProductCard({ product, onSelect }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cacao-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button type="button" onClick={() => onSelect(product)} className="text-left" aria-label={`Ver ${product.name}`}>
        <ProductImage src={product.imageUrl} alt={product.name} className="h-48 w-full" />
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold leading-snug text-cacao-800">{product.name}</h3>
        <div className="mt-auto">
          <p className="text-xl font-bold text-gold-600">
            {product.isQuoteOnly || product.priceCop === null ? "Cotizar" : formatCop(product.priceCop)}
          </p>
          {product.priceNote && <p className="text-xs text-cacao-500">{product.priceNote}</p>}
        </div>
        <button type="button" onClick={() => onSelect(product)} className="btn-primary mt-2 w-full">
          Personalizar y agregar
        </button>
      </div>
    </article>
  );
}
