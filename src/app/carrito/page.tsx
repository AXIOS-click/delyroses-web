import { CartView } from "@/components/cart/cart-view";
import { buildJuiceMetadata } from "@/lib/juice-seo";

export const metadata = buildJuiceMetadata({
  title: "Carrito",
  description: "Carrito de compras de Dely Roses.",
  path: "/carrito",
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}
