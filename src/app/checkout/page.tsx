import { CheckoutForm } from "@/components/checkout/checkout-form";
import { buildJuiceMetadata } from "@/lib/juice-seo";

export const metadata = buildJuiceMetadata({
  title: "Finalizar compra",
  description: "Finalización de compra de Dely Roses.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutForm />;
}
