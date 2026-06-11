import { siteConfig } from "@/lib/site";

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
