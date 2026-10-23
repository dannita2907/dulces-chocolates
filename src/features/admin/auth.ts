import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "./session";

/** Defensa en profundidad: se llama en cada página y acción de admin, además del middleware. */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!(await isValidSession(store.get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
}
