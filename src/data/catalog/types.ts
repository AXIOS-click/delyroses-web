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
  categorySlug: string;
  tagSlugs: string[];
};

export type CatalogProduct = CatalogProductJson & {
  category: CatalogCategory;
  tags: CatalogTag[];
  urlPath: `/producto/${string}`;
  primaryImageUrl?: string;
};
