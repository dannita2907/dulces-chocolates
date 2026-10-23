// Seguro para Edge (middleware) y Node: solo usa `jose`.
import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "dr_admin";
const SESSION_HOURS = 8;

function getKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET debe tener al menos 32 caracteres");
  return new TextEncoder().encode(secret);
}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getKey());
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_HOURS * 60 * 60;
