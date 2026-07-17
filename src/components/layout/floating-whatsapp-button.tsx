"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

type FloatingWhatsappButtonProps = {
  whatsappUrl?: string;
};

export function FloatingWhatsappButton({ whatsappUrl }: FloatingWhatsappButtonProps) {
  const pathname = usePathname();
  const isProductRoute = pathname === "/productos" || pathname.startsWith("/producto/");

  if (!whatsappUrl || isProductRoute) return null;

  const whatsappHref = `${whatsappUrl}?text=${encodeURIComponent("Hola Dely Roses, quiero información sobre sus arreglos florales.")}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a Dely Roses por WhatsApp"
      title="Contactar por WhatsApp"
      data-contact-channel="whatsapp"
      data-contact-purpose="customer-service"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-success px-5 py-4 font-bold text-white shadow-2xl shadow-black/20 transition hover:scale-105 hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-success/30 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
      <span className="sr-only">Abrir chat de WhatsApp para atención al cliente de Dely Roses</span>
    </a>
  );
}
