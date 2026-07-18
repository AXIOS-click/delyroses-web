import Link from "next/link";

import { getCategories } from "@/data/catalog";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const categories = getCategories();

  return (
    <footer className="mt-20 bg-surface-dark text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-2xl font-bold tracking-[-0.04em]">{siteConfig.name}</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-background/76">{siteConfig.description}</p>
        </div>

        <div>
          <p className="font-bold">Catálogo</p>
          <ul className="mt-4 space-y-2 text-sm text-background/76">
            <li>
              <Link href="/productos" className="hover:text-background">
                Todos los productos
              </Link>
            </li>
            {categories.slice(0, 4).map((category) => (
              <li key={category.slug}>
                <Link href={`/categoria/${category.slug}`} className="hover:text-background">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-bold">Contacto</p>
          <div className="mt-4 space-y-2 text-sm text-background/76">
            {siteConfig.whatsappUrl ? (
              <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer" className="block hover:text-background">
                WhatsApp
              </a>
            ) : (
              <p>Configura WhatsApp con NEXT_PUBLIC_WHATSAPP_NUMBER.</p>
            )}
            {siteConfig.contactEmail ? <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> : null}
          </div>
        </div>

        <div>
          <p className="font-bold">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-background/76">
            <li>
              <Link href="/politica-devoluciones" className="hover:text-background">
                Política de devoluciones
              </Link>
            </li>
            <li>
              <Link href="/politica-privacidad" className="hover:text-background">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
