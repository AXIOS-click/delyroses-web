import { Link, useNavigate } from "react-router";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Producto Premium 1", price: 2999, quantity: 2, image: "" },
    { id: 2, name: "Producto 2", price: 4599, quantity: 1, image: "" },
    { id: 3, name: "Producto 3", price: 1899, quantity: 3, image: "" },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-neutral-600 mb-6">Tu carrito está vacío</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-300 rounded-lg p-4 flex gap-4"
              >
                <div className="w-24 h-24 bg-neutral-200 rounded-lg flex-shrink-0"></div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-neutral-900 mb-1">{item.name}</h3>
                  <p className="text-lg font-bold text-neutral-900">${item.price}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-neutral-100"
                      >
                        <Minus className="w-4 h-4 text-neutral-700" />
                      </button>
                      <span className="px-4 py-2 font-bold text-neutral-900 min-w-[50px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-100"
                      >
                        <Plus className="w-4 h-4 text-neutral-700" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-neutral-100 rounded-lg ml-auto"
                    >
                      <Trash2 className="w-5 h-5 text-neutral-500" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-neutral-900">
                    ${item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div>
            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-300">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal ({cartItems.length} productos)</span>
                  <span className="font-bold">${subtotal}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Envío</span>
                  <span className="font-bold">
                    {shipping === 0 ? "Gratis" : `$${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-neutral-900 mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-4 rounded-lg hover:bg-neutral-800 transition-colors mb-3"
              >
                Continuar compra
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/productos"
                className="block text-center text-neutral-600 hover:text-neutral-900 py-2"
              >
                Seguir comprando
              </Link>

              {subtotal < 5000 && (
                <div className="bg-neutral-100 rounded-lg p-4 mt-4 text-sm text-neutral-700">
                  Agregá ${5000 - subtotal} más para obtener envío gratis
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
