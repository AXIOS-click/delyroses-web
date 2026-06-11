import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";
import { navItems, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex flex-col leading-none" aria-label={`${siteConfig.name} inicio`}>
          <span className="text-2xl font-bold tracking-[-0.04em] text-foreground">{siteConfig.shortName}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">floral atelier</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <CartLink />
      </div>
    </header>
  );
}
