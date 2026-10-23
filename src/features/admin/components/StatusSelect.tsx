"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "../actions";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatusValue } from "../constants";

interface Props {
  orderId: number;
  current: OrderStatusValue;
}

export function StatusSelect({ orderId, current }: Props) {
  const [value, setValue] = useState<OrderStatusValue>(current);
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  const onChange = (next: OrderStatusValue) => {
    const previous = value;
    setValue(next);
    setFailed(false);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, next);
      if (!res.ok) {
        setValue(previous);
        setFailed(true);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => onChange(e.target.value as OrderStatusValue)}
        className="input w-auto"
        aria-label={`Estado del pedido ${orderId}`}
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {failed && <span className="text-xs text-red-700">No se pudo actualizar</span>}
    </div>
  );
}
