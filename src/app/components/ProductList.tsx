import { Link } from "react-router";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ProductList() {
  const [showFilters, setShowFilters] = useState(false);

  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Producto ${i + 1}`,
    price: Math.floor(Math.random() * 5000) + 1000,
    category: ["Electrónica", "Ropa", "Hogar", "Deportes"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Todos los Productos</h1>

        {/* Buscador */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-3 border-2 border-neutral-300 rounded-lg hover:border-neutral-900"
          >
            <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filtros laterales */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
          <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Categorías</h3>
            <div className="space-y-2">
              {["Todas", "Electrónica", "Ropa", "Hogar", "Deportes"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-neutral-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Precio</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-600">Mínimo</label>
                <input
                  type="number"
                  placeholder="$0"
                  className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-600">Máximo</label>
                <input
                  type="number"
                  placeholder="$10000"
                  className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Ordenar por</h3>
            <select className="w-full px-3 py-2 border border-neutral-300 rounded">
              <option>Más relevante</option>
              <option>Menor precio</option>
              <option>Mayor precio</option>
              <option>Más vendidos</option>
            </select>
          </div>
        </aside>

        {/* Grid de productos */}
        <div className="flex-1">
          <div className="mb-4 text-neutral-600">
            Mostrando 12 de 156 productos
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/producto/${product.id}`}
                className="bg-white border border-neutral-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-neutral-200"></div>
                <div className="p-4">
                  <p className="text-xs text-neutral-500 mb-1">{product.category}</p>
                  <h3 className="font-bold text-neutral-900 mb-2">{product.name}</h3>
                  <p className="text-xl font-bold text-neutral-900">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-center gap-2">
            <button className="p-2 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 disabled:opacity-50">
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 border-2 rounded-lg ${
                  page === 1
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-300 hover:border-neutral-900"
                }`}
              >
                {page}
              </button>
            ))}

            <button className="p-2 border-2 border-neutral-300 rounded-lg hover:border-neutral-900">
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
