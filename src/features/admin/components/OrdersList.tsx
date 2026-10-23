import { formatCop, formatDate } from "@/lib/format";
import { StatusSelect } from "./StatusSelect";
import type { OrderStatusValue } from "../constants";

export interface AdminOrder {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  notes: string | null;
  totalCop: number;
  hasQuoteItems: boolean;
  status: OrderStatusValue;
  createdAt: Date;
  items: { id: number; productName: string; quantity: number; unitPriceCop: number | null; notes: string | null }[];
}

export function OrdersList({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) return <p className="py-10 text-center text-cacao-500">No hay pedidos.</p>;

  return (
    <ul className="space-y-5">
      {orders.map((o) => (
        <li key={o.id} className="rounded-2xl border border-cacao-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-cacao-800">
                Pedido #{o.id} · {o.customerName}
              </h2>
              <p className="text-xs text-cacao-500">{formatDate(o.createdAt)}</p>
            </div>
            <StatusSelect orderId={o.id} current={o.status} />
          </div>

          <div className="mt-3 grid gap-1 text-sm text-cacao-700">
            <p>
              📞{" "}
              <a
                className="underline"
                href={`https://wa.me/${o.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {o.phone}
              </a>
            </p>
            <p>📍 {o.address}</p>
          </div>

          <ul className="mt-4 divide-y divide-cacao-100 text-sm">
            {o.items.map((i) => (
              <li key={i.id} className="py-2">
                <div className="flex justify-between gap-2">
                  <span>
                    {i.productName} <span className="text-cacao-500">x{i.quantity}</span>
                  </span>
                  <span className="shrink-0 text-cacao-600">
                    {i.unitPriceCop === null ? "Por cotizar" : formatCop(i.unitPriceCop * i.quantity)}
                  </span>
                </div>
                {i.notes && <p className="mt-1 rounded bg-gold-300/20 px-2 py-1 text-xs text-cacao-700">📝 {i.notes}</p>}
              </li>
            ))}
          </ul>

          {o.notes && (
            <p className="mt-3 rounded-lg bg-cacao-50 px-3 py-2 text-sm text-cacao-700">
              <strong>Notas del pedido:</strong> {o.notes}
            </p>
          )}

          <p className="mt-3 text-right font-bold text-cacao-800">
            Total estimado: {formatCop(o.totalCop)}
            {o.hasQuoteItems && <span className="ml-2 text-xs font-normal text-cacao-500">(+ ítems por cotizar)</span>}
          </p>
        </li>
      ))}
    </ul>
  );
}
