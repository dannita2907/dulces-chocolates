import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/auth";
import { logoutAction } from "@/features/admin/actions";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatusValue } from "@/features/admin/constants";
import { OrdersList } from "@/features/admin/components/OrdersList";
import { BRAND_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: `Admin | ${BRAND_NAME}`, robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ estado?: string }>;
}

export default async function AdminPage({ searchParams }: Props) {
  await requireAdmin();
  const { estado } = await searchParams;
  const filter = ORDER_STATUSES.find((s) => s === estado);

  const orders = await prisma.order.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cacao-800">Pedidos</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-cacao-500 hover:underline">
            Cerrar sesión
          </button>
        </form>
      </div>

      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link href="/admin" className={`rounded-full border px-3 py-1 ${!filter ? "bg-cacao-700 text-cream" : "bg-white"}`}>
          Todos
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin?estado=${s}`}
            className={`rounded-full border px-3 py-1 ${filter === s ? "bg-cacao-700 text-cream" : "bg-white"}`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </nav>

      <OrdersList orders={orders.map((o) => ({ ...o, status: o.status as OrderStatusValue }))} />
    </div>
  );
}
