"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/app/components/ui/carousel";
import type { CatalogCategory } from "@/data/catalog/types";

export function CategoryCarousel({ categories }: { categories: CatalogCategory[] }) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 3500);

    return () => window.clearInterval(interval);
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="px-8 sm:px-10">
      <CarouselContent>
        {categories.map((category) => (
          <CarouselItem key={category.slug} className="basis-[85%] sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <Link
              href={`/categoria/${category.slug}`}
              className="flex h-full min-h-56 flex-col rounded-[1.75rem] border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{category.slug}</p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-foreground">{category.name}</h3>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 size-10 bg-card shadow-sm" />
      <CarouselNext className="right-0 size-10 bg-card shadow-sm" />
    </Carousel>
  );
}
