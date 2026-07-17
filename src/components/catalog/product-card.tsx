import Image from "next/image";
import Link from "next/link";

import type { CatalogProduct } from "@/data/catalog/types";
import { formatMoney } from "@/lib/money";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const categorySummary = product.categories
    .slice(0, 3)
    .map((category) => category.name)
    .join(", ");
  const extraCategories = product.categories.length > 3 ? ` +${product.categories.length - 3}` : "";

  return (
    <Link
      href={product.urlPath}
      className="group overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-rose">
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_35%_30%,#fff_0,#fce5ec_35%,#f6d8e1_70%)] px-6 text-center text-sm font-bold uppercase tracking-[0.22em] text-accent">
            Próxima imagen
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {categorySummary}
          {extraCategories}
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-foreground">{product.name}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
        <p className="mt-4 text-2xl font-bold text-accent">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}
