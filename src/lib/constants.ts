const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatCop = (value: number): string => copFormatter.format(value);

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

export const formatDate = (date: Date): string => dateFormatter.format(date);

export const BRAND_NAME = "Dulces Chocolates";

export const PRICE_VARIATION_NOTICE = 
  "Los precios pueden variar según la personalización o requieran cotización directa.";