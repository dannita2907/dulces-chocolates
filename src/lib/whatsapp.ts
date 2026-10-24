
import { formatCop } from "@/lib/format";

export interface OrderMessageItem {
  productName: string;
  unitPriceCop: number | null;
  quantity: number;
  notes: string | null;
}

export interface OrderMessageData {
  orderId: number;
  customerName: string;
  phone: string;
  address: string;
  notes: string | null;
  items: OrderMessageItem[];
  totalCop: number;
  hasQuoteItems: boolean;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(order: OrderMessageData): string {
  const lines: string[] = [];

  lines.push(`¡Hola! Quiero confirmar mi pedido #${order.orderId}`, "");

  lines.push("*Productos:*");
  for (const item of order.items) {
    const price =
      item.unitPriceCop === null ? "por cotizar" : formatCop(item.unitPriceCop * item.quantity);
    lines.push(`• ${item.quantity} x ${item.productName} — ${price}`);
    if (item.notes) lines.push(`   _Personalización: ${item.notes}_`);
  }
  lines.push("");

  if (order.hasQuoteItems && order.totalCop === 0) {
    lines.push("*Total:* por cotizar");
  } else if (order.hasQuoteItems) {
    lines.push(`*Total estimado:* ${formatCop(order.totalCop)} + productos por cotizar`);
  } else {
    lines.push(`*Total:* ${formatCop(order.totalCop)}`);
  }
  lines.push("");

  lines.push("*Mis datos:*");
  lines.push(`Nombre: ${order.customerName}`);
  lines.push(`Teléfono: ${order.phone}`);
  lines.push(`Dirección: ${order.address}`);
  if (order.notes) lines.push(`Notas: ${order.notes}`);

  return lines.join("\n");
}