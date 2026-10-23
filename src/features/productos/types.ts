export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
}

export interface ProductDTO {
  id: number;
  slug: string;
  name: string;
  description: string;
  priceCop: number | null;
  priceNote: string | null;
  imageUrl: string | null;
  isQuoteOnly: boolean;
  categoryId: number;
  categorySlug: string;
}
