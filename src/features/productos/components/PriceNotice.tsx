import { PRICE_VARIATION_NOTICE } from "@/lib/constants";

export function PriceNotice({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`rounded-xl border border-gold-500/50 bg-gold-300/20 px-4 py-3 text-sm text-cacao-800 ${className}`}
    >
      <span className="mr-1" aria-hidden>
        ✨
      </span>
      {PRICE_VARIATION_NOTICE}
    </div>
  );
}
