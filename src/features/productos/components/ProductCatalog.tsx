"use client";

import { useMemo, useState } from "react";
import type { CategoryDTO, ProductDTO } from "../types";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

interface Props {
  categories: CategoryDTO[];
  products: ProductDTO[];
}

export function ProductCatalog({ categories, products }: Props) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selected, setSelected] = useState<ProductDTO | null>(null);

  const visible = useMemo(
    () => (activeCategory === "todos" ? products : products.filter((p) => p.categorySlug === activeCategory)),
    [activeCategory, products],
  );

  return (
    <>
      <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />

      {visible.length === 0 ? (
        <p className="text-center text-cacao-500">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
