export type CatalogCategory = {
  slug: string;
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type CatalogTag = {
  slug: string;
  name: string;
  description?: string;
};

export type CatalogProductJson = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  categorySlugs: string[];
  tagSlugs: string[];
  composition: string[];
  presentation: string[];
  importantNotes: string[];
};

export type CatalogProduct = CatalogProductJson & {
  category: CatalogCategory;
  categories: CatalogCategory[];
  tags: CatalogTag[];
  urlPath: `/producto/${string}`;
  primaryImageUrl?: string;
};
