import type { CategoryDTO } from "../types";

interface Props {
  categories: CategoryDTO[];
  active: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  const options = [{ id: 0, name: "Todos", slug: "todos" }, ...categories];

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrar por categoría">
      {options.map((c) => {
        const selected = active === c.slug;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(c.slug)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              selected
                ? "border-cacao-700 bg-cacao-700 text-cream"
                : "border-cacao-200 bg-white text-cacao-700 hover:border-gold-500"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
