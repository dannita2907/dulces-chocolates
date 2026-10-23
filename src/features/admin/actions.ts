"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./auth";
import { ADMIN_COOKIE, SESSION_MAX_AGE_SECONDS, signSession } from "./session";
import { ORDER_STATUSES } from "./constants";

export interface LoginState {
  error?: string;
}

const sha256 = (value: string): Buffer => createHash("sha256").update(value).digest();

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "ADMIN_PASSWORD no está configurada en el servidor." };

  const given = String(formData.get("password") ?? "");
  // Comparación en tiempo constante sobre digests del mismo largo.
  if (!timingSafeEqual(sha256(given), sha256(expected))) return { error: "Contraseña incorrecta." };

  const store = await cookies();
  store.set(ADMIN_COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const statusSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.enum(ORDER_STATUSES),
});

export async function updateOrderStatus(orderId: number, status: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  const parsed = statusSchema.safeParse({ orderId, status });
  if (!parsed.success) return { ok: false };

  await prisma.order.update({ where: { id: parsed.data.orderId }, data: { status: parsed.data.status } });
  revalidatePath("/admin");
  return { ok: true };
}
