export function formatCop(amount: number | null | undefined): string {
  if (amount == null) return "Cotizar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}