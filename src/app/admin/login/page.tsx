"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/features/admin/actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="mb-6 text-center text-2xl font-bold text-cacao-800">Panel de administración</h1>
      <form action={formAction} className="space-y-4 rounded-2xl border border-cacao-100 bg-white p-6">
        <label className="block text-sm font-medium">
          Contraseña
          <input name="password" type="password" required autoComplete="current-password" className="input mt-1" />
        </label>
        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
