"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { useCart } from "@/features/carrito/cart-context";
import { CartSummary } from "@/features/carrito/components/CartSummary";
import { PriceNotice } from "@/features/productos/components/PriceNotice";
import { createOrder } from "../actions";
import type { CreateOrderResult } from "../schema";

type Success = Extract<CreateOrderResult, { ok: true }>;

export function CheckoutForm() {
  const { items, hydrated, clear } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [success, setSuccess] = useState<Success | null>(null);

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-gold-500/40 bg-white p-8 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="mt-2 text-2xl font-bold text-cacao-800">¡Pedido #{success.orderId} guardado!</h2>
        <p className="mt-2 text-sm text-cacao-600">
          Para terminar, envía el mensaje por WhatsApp. Si no se abrió automáticamente, usa el botón.
        </p>
        <a href={success.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
          Enviar por WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/" className="text-sm text-cacao-500 hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated) return <p className="py-20 text-center text-cacao-500">Cargando…</p>;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-cacao-600">No hay productos en tu carrito.</p>
        <Link href="/#catalogo" className="btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await createOrder({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        notes: String(form.get("notes") ?? ""),
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, notes: i.notes })),
      });

      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      clear();
      setSuccess(result);
      // Abre WhatsApp con el mensaje ya redactado (el cliente solo presiona "Enviar").
      window.location.assign(result.whatsappUrl);
    });
  };

  const fieldError = (key: string) =>
    fieldErrors[key]?.[0] ? <p className="mt-1 text-xs text-red-700">{fieldErrors[key]?.[0]}</p> : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <PriceNotice />

        <label className="block text-sm font-medium">
          Nombre completo
          <input name="name" required autoComplete="name" className="input mt-1" />
          {fieldError("name")}
        </label>

        <label className="block text-sm font-medium">
          Teléfono / WhatsApp
          <input name="phone" type="tel" required autoComplete="tel" className="input mt-1" placeholder="+57 300 000 0000" />
          {fieldError("phone")}
        </label>

        <label className="block text-sm font-medium">
          Dirección de entrega
          <input name="address" required autoComplete="street-address" className="input mt-1" />
          {fieldError("address")}
        </label>

        <label className="block text-sm font-medium">
          Comentarios y notas del pedido
          <textarea
            name="notes"
            rows={4}
            maxLength={1000}
            className="input mt-1"
            placeholder="Fecha de entrega, dedicatorias, solicitudes especiales..."
          />
          {fieldError("notes")}
        </label>

        {fieldError("items")}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <button type="submit" disabled={isPending} className="btn-gold w-full">
          {isPending ? "Guardando pedido…" : "Finalizar y enviar por WhatsApp"}
        </button>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <CartSummary />
        <ul className="space-y-1 rounded-2xl border border-cacao-100 bg-white p-4 text-sm">
          {items.map((i) => (
            <li key={i.lineId} className="flex justify-between gap-2">
              <span className="truncate">{i.name}</span>
              <span className="shrink-0 text-cacao-500">x{i.quantity}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
