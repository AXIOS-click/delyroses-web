import { Link, useNavigate } from "react-router";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate("/carrito");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-neutral-600">
        <Link to="/" className="hover:text-neutral-900">Inicio</Link>
        {" / "}
        <Link to="/productos" className="hover:text-neutral-900">Productos</Link>
        {" / "}
        <span className="text-neutral-900">Producto 1</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Imagen del producto */}
        <div>
          <div className="aspect-square bg-neutral-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-neutral-200 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 cursor-pointer"></div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div>
          <p className="text-sm text-neutral-500 mb-2">Electrónica</p>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Producto Premium 1
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-4xl font-bold text-neutral-900">$2.999</p>
            <p className="text-xl text-neutral-400 line-through">$3.499</p>
          </div>

          <div className="border-t border-b border-neutral-300 py-6 mb-6">
            <h3 className="font-bold text-neutral-900 mb-3">Descripción</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Este es un producto de alta calidad diseñado para satisfacer todas tus necesidades.
              Cuenta con características premium y un diseño moderno que se adapta a cualquier espacio.
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2"></span>
                <span>Característica destacada 1</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2"></span>
                <span>Característica destacada 2</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2"></span>
                <span>Característica destacada 3</span>
              </li>
            </ul>
          </div>

          {/* Selector de cantidad */}
          <div className="mb-6">
            <label className="block font-bold text-neutral-900 mb-3">Cantidad</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-neutral-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-neutral-100 border-r-2 border-neutral-300"
                >
                  <Minus className="w-5 h-5 text-neutral-700" />
                </button>
                <span className="px-6 py-3 font-bold text-neutral-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-neutral-100 border-l-2 border-neutral-300"
                >
                  <Plus className="w-5 h-5 text-neutral-700" />
                </button>
              </div>
              <p className="text-neutral-600">Stock disponible: 15</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-4 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Agregar al carrito
            </button>
            <button className="p-4 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors">
              <Heart className="w-6 h-6 text-neutral-700" />
            </button>
          </div>

          {/* Información adicional */}
          <div className="bg-neutral-100 rounded-lg p-4 space-y-2 text-sm text-neutral-700">
            <p>✓ Envío gratis en compras mayores a $5.000</p>
            <p>✓ Garantía de 12 meses</p>
            <p>✓ Devolución gratis en los primeros 30 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
