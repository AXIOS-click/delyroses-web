import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const categories = [
    { id: 1, name: "Electrónica", count: 45 },
    { id: 2, name: "Ropa", count: 128 },
    { id: 3, name: "Hogar", count: 67 },
    { id: 4, name: "Deportes", count: 89 },
  ];

  const popularProducts = [
    { id: 1, name: "Producto 1", price: 2999 },
    { id: 2, name: "Producto 2", price: 4599 },
    { id: 3, name: "Producto 3", price: 1899 },
    { id: 4, name: "Producto 4", price: 3499 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-neutral-200 border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Encuentra todo lo que necesitas
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Miles de productos con la mejor calidad y precio del mercado
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Ver productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">
          Categorías Destacadas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/productos"
              className="bg-white border-2 border-neutral-300 rounded-lg p-6 hover:border-neutral-900 transition-colors"
            >
              <div className="aspect-square bg-neutral-200 rounded-lg mb-4"></div>
              <h3 className="font-bold text-neutral-900">{category.name}</h3>
              <p className="text-sm text-neutral-500">{category.count} productos</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Populares */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Productos Populares
          </h2>
          <Link to="/productos" className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {popularProducts.map((product) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              className="bg-white border border-neutral-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-neutral-200"></div>
              <div className="p-4">
                <h3 className="font-bold text-neutral-900 mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-neutral-900">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
