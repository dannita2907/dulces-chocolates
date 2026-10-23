import { prisma } from "@/lib/prisma";
import type { CategoryDTO, ProductDTO } from "./types";

export async function getCatalog(): Promise<{ categories: CategoryDTO[]; products: ProductDTO[] }> {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      include: { category: { select: { slug: true } } },
    }),
  ]);

  return {
    categories,
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      priceCop: p.priceCop,
      priceNote: p.priceNote,
      imageUrl: p.imageUrl,
      isQuoteOnly: p.isQuoteOnly,
      categoryId: p.categoryId,
      categorySlug: p.category.slug,
    })),
  };
}
