"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

const STORAGE_KEY = "dulce-rincon-cart-v1";
const MAX_QTY = 99;

export interface CartItem {
  lineId: string;
  productId: number;
  name: string;
  unitPriceCop: number | null;
  imageUrl: string | null;
  quantity: number;
  notes: string;
}

export type NewCartItem = Omit<CartItem, "lineId">;

interface State {
  items: CartItem[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: NewCartItem }
  | { type: "setQuantity"; lineId: string; quantity: number }
  | { type: "setNotes"; lineId: string; notes: string }
  | { type: "remove"; lineId: string }
  | { type: "clear" };

const clamp = (n: number): number => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId && i.notes === action.item.notes,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.lineId === existing.lineId ? { ...i, quantity: clamp(i.quantity + action.item.quantity) } : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: clamp(action.item.quantity), lineId: crypto.randomUUID() }],
      };
    }
    case "setQuantity":
      return {
        ...state,
        items: state.items.map((i) => (i.lineId === action.lineId ? { ...i, quantity: clamp(action.quantity) } : i)),
      };
    case "setNotes":
      return {
        ...state,
        items: state.items.map((i) => (i.lineId === action.lineId ? { ...i, notes: action.notes } : i)),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.lineId !== action.lineId) };
    case "clear":
      return { ...state, items: [] };
  }
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  /** Suma de los ítems que tienen precio. */
  subtotalCop: number;
  hasQuoteItems: boolean;
  addItem: (item: NewCartItem) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  setNotes: (lineId: string, notes: string) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.lineId === "string" &&
    typeof v.productId === "number" &&
    typeof v.name === "string" &&
    (v.unitPriceCop === null || typeof v.unitPriceCop === "number") &&
    typeof v.quantity === "number" &&
    typeof v.notes === "string"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  useEffect(() => {
    let items: CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) items = parsed.filter(isCartItem);
      }
    } catch {
      /* almacenamiento no disponible o corrupto: carrito vacío */
    }
    dispatch({ type: "hydrate", items });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignorar */
    }
  }, [state.items, state.hydrated]);

  const addItem = useCallback((item: NewCartItem) => dispatch({ type: "add", item }), []);
  const setQuantity = useCallback((lineId: string, quantity: number) => dispatch({ type: "setQuantity", lineId, quantity }), []);
  const setNotes = useCallback((lineId: string, notes: string) => dispatch({ type: "setNotes", lineId, notes }), []);
  const removeItem = useCallback((lineId: string) => dispatch({ type: "remove", lineId }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      hydrated: state.hydrated,
      itemCount: state.items.reduce((s, i) => s + i.quantity, 0),
      subtotalCop: state.items.reduce((s, i) => s + (i.unitPriceCop ?? 0) * i.quantity, 0),
      hasQuoteItems: state.items.some((i) => i.unitPriceCop === null),
      addItem,
      setQuantity,
      setNotes,
      removeItem,
      clear,
    }),
    [state, addItem, setQuantity, setNotes, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
