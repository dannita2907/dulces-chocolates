import { getCatalog } from "@/features/productos/queries";
import { ProductCatalog } from "@/features/productos/components/ProductCatalog";
import { PriceNotice } from "@/features/productos/components/PriceNotice";
import { ChocolateBackground } from "@/components/ChocolateBackground";
import { ChocolateBar } from "@/components/ChocolateBar";
import { BRAND_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { categories, products } = await getCatalog();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-cacao-900 to-cacao-700 text-cream">
        <ChocolateBackground />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-300">Hecho a mano</p>
          <h1 className="text-4xl font-bold sm:text-6xl">{BRAND_NAME}</h1>
          <p className="mx-auto mt-4 max-w-xl text-cacao-100">
            Chocolates artesanales, estuches temáticos y detalles personalizados para cada ocasión.
          </p>
          <div className="mt-10 flex justify-center">
            <ChocolateBar />
          </div>
          <a href="#catalogo" className="btn-gold mt-8">
            Ver catálogo
          </a>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="mb-6 text-center text-3xl font-bold text-cacao-800">Nuestro catálogo</h2>
        <PriceNotice className="mx-auto mb-8 max-w-3xl" />
        <ProductCatalog categories={categories} products={products} />
      </section>
    </>
  );
}
