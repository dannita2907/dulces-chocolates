import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(150),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Ingresa un teléfono válido"),
  address: z.string().trim().min(5, "Ingresa tu dirección").max(300),
  notes: z.string().trim().max(1000).optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(99),
        notes: z.string().trim().max(500).optional(),
      }),
    )
    .min(1, "Tu carrito está vacío")
    .max(50),
});

export type CheckoutPayload = z.infer<typeof checkoutSchema>;

export type CreateOrderResult =
  | { ok: true; orderId: number; whatsappUrl: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
