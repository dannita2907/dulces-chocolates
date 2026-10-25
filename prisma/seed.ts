import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugify = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface SeedCategory {
  name: string;
  sortOrder: number;
}

interface SeedProduct {
  name: string;
  priceCop: number | null;
  category: string;
  description: string;
  priceNote?: string;
  isQuoteOnly?: boolean;
}

const categories: SeedCategory[] = [
  { name: "Estuches temáticos", sortOrder: 1 },
  { name: "Bombones y trufas", sortOrder: 2 },
  { name: "Casitas y cofres", sortOrder: 3 },
  { name: "Halloween", sortOrder: 4 },
  { name: "Fechas especiales", sortOrder: 5 },
];

const products: SeedProduct[] = [
  { name: "Minitrufas en frasco", priceCop: 15000, category: "Bombones y trufas", description: "Minitrufas artesanales presentadas en frasco, ideales para regalar." },
  { name: "Juego de corbatas", priceCop: 30000, category: "Estuches temáticos", description: "Corbatas de chocolate en estuche, un detalle original para papá." },
  { name: "Estuche de herramientas", priceCop: 22000, category: "Estuches temáticos", description: "Herramientas de chocolate en estuche de presentación." },
  { name: "Estuche de botellas de licor (chocolate relleno)", priceCop: 25000, category: "Estuches temáticos", description: "Botellas de chocolate rellenas, presentadas en estuche." },
  { name: "Juego de bolos en estuche", priceCop: 30000, category: "Estuches temáticos", description: "Juego de bolos de chocolate en estuche.", priceNote: "Precio estimado base" },
  { name: "Estuche de camisa, corbata y pipa", priceCop: 18000, category: "Estuches temáticos", description: "Camisa, corbata y pipa de chocolate en un mismo estuche." },
  { name: "Estuche de cenicero y pipa", priceCop: 35000, category: "Estuches temáticos", description: "Cenicero y pipa de chocolate en estuche de regalo." },
  { name: "Estuche de juego de ajedrez", priceCop: 40000, category: "Estuches temáticos", description: "Juego de ajedrez de chocolate en estuche." },
  { name: "Estuche de juego de billar", priceCop: 40000, category: "Estuches temáticos", description: "Juego de billar de chocolate en estuche." },
  { name: "Caja de corazones rellenos x 10 unidades", priceCop: 27000, category: "Bombones y trufas", description: "Diez corazones de chocolate rellenos." },
  { name: "Barra de chocolate con frutos secos", priceCop: 25000, category: "Bombones y trufas", description: "Barra de chocolate artesanal con frutos secos." },
  { name: "Casita de chocolate", priceCop: 60000, category: "Casitas y cofres", description: "Casita de chocolate artesanal." },
  { name: "Fresas con chocolate casa x 10 unidades", priceCop: 17000, category: "Bombones y trufas", description: "Diez fresas cubiertas con chocolate." },
  { name: "Estuche de juego de raquetas de tenis", priceCop: 25000, category: "Estuches temáticos", description: "Raquetas de tenis de chocolate en estuche." },
  { name: "Cofre blanco de osito", priceCop: 30000, category: "Casitas y cofres", description: "Cofre de chocolate blanco con motivo de osito." },
  { name: "Caja de trufas x 10 unidades", priceCop: 25000, category: "Bombones y trufas", description: "Caja con diez trufas artesanales." },
  { name: "Chocolates de diseño con serigrafía y rellenos x 10 unidades", priceCop: 30000, category: "Bombones y trufas", description: "Diez chocolates rellenos con diseño en serigrafía." },
  { name: "Cofre de chocolate con serigrafía", priceCop: 40000, category: "Casitas y cofres", description: "Cofre de chocolate decorado con serigrafía." },
  { name: "Chocolates de osito rellenos x 10 unidades", priceCop: 25000, category: "Bombones y trufas", description: "Diez ositos de chocolate rellenos." },
  { name: "Casita de Halloween", priceCop: 40000, category: "Halloween", description: "Casita de chocolate con motivo de Halloween." },
  { name: "Diseños de chocolate motivo Halloween x 10 unidades", priceCop: 20000, category: "Halloween", description: "Diez chocolates con diseños de Halloween." },
  { name: "Caja de patitas de chocolate rellenos x 10 unidades", priceCop: 35000, category: "Bombones y trufas", description: "Diez patitas de chocolate rellenas." },
  { name: "Cofre de chocolate negro semiamargo", priceCop: 20000, category: "Casitas y cofres", description: "Cofre de chocolate negro semiamargo." },
  { name: "Placa para mamá", priceCop: 13000, category: "Fechas especiales", description: "Placa de chocolate pensada como detalle para mamá." },
  { name: "Fresas con chocolate (tematica mariquitas)", priceCop: 8000, category: "Bombones y trufas", description: "Fresas con chocolate con tema de mariquitas.", },
];

async function main(): Promise<void> {
  const categoryIds = new Map<string, number>();

  for (const c of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: { name: c.name, slug: slugify(c.name), sortOrder: c.sortOrder },
    });
    categoryIds.set(c.name, saved.id);
  }

  for (const p of products) {
    const categoryId = categoryIds.get(p.category);
    if (categoryId === undefined) throw new Error(`Categoría no encontrada: ${p.category}`);
    const slug = slugify(p.name);
    const data = {
      name: p.name,
      description: p.description,
      priceCop: p.priceCop,
      priceNote: p.priceNote ?? null,
      isQuoteOnly: p.isQuoteOnly ?? false,
      categoryId,
      // Coloca la foto en public/images/products/<slug>.jpg
      imageUrl: `/images/products/${slug}.jpg`,
    };
    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
  }

  console.log(`Seed listo: ${categories.length} categorías, ${products.length} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
