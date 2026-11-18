export type CatalogCategory = {
  slug: string;
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  guide?: { heading: string; body: string }[];
  lastModified?: string;
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
  filterCategorySlugs: string[];
  tagSlugs: string[];
  composition: string[];
  presentation: string[];
  importantNotes: string[];
  lastModified?: string;
};

export type CatalogProduct = CatalogProductJson & {
  category: CatalogCategory;
  categories: CatalogCategory[];
  tags: CatalogTag[];
  urlPath: `/producto/${string}`;
  primaryImageUrl?: string;
};
