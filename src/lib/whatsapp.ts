// Cambia el nombre de la tienda SOLO aquí (usa "Chocolates" si prefieres algo simple).
export const BRAND_NAME = "Dulces Chocolates";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573002246669";

export const PRICE_VARIATION_NOTICE =
  "Los precios pueden variar según preferencias en cantidad de productos, diseños especiales y personalizaciones adicionales.";

export const MAX_NOTES_LENGTH = 500;

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function buildOrderMessage(orderData: any): string {
  return `¡Hola! Me gustaría confirmar el siguiente pedido:\n` +
    (orderData?.items ? orderData.items.map((i: any) => `- ${i.quantity}x ${i.name}`).join('\n') : '') +
    `\nTotal: $${orderData?.total || 0}`;
}
