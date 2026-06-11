import { useNavigate } from "react-router";
import { Building2, User, MapPin, CreditCard } from "lucide-react";
import { useState } from "react";

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    provincia: "",
  });

  const cartItems = [
    { id: 1, name: "Producto Premium 1", price: 2999, quantity: 2 },
    { id: 2, name: "Producto 2", price: 4599, quantity: 1 },
    { id: 3, name: "Producto 3", price: 1899, quantity: 3 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/confirmacion/12345");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del cliente */}
            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-neutral-700" />
                <h2 className="text-xl font-bold text-neutral-900">
                  Datos del Cliente
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-900 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    placeholder="ejemplo@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-neutral-700" />
                <h2 className="text-xl font-bold text-neutral-900">
                  Dirección de Envío
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    placeholder="Calle 123, Piso 4, Depto B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-900 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      placeholder="Buenos Aires"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-900 mb-2">
                      Provincia *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.provincia}
                      onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      placeholder="CABA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-900 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.codigoPostal}
                      onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      placeholder="1234"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-neutral-700" />
                <h2 className="text-xl font-bold text-neutral-900">
                  Método de Pago
                </h2>
              </div>

              <div className="bg-neutral-900 text-white rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Transferencia Bancaria</h3>
                    <p className="text-sm text-neutral-300 mb-3">
                      Realizá tu transferencia a los siguientes datos:
                    </p>
                    <div className="text-sm space-y-1 bg-neutral-800 p-4 rounded">
                      <p><strong>Banco:</strong> Banco Ejemplo</p>
                      <p><strong>Titular:</strong> Ecommerce SA</p>
                      <p><strong>CBU:</strong> 1234567890123456789012</p>
                      <p><strong>Alias:</strong> TIENDA.ONLINE</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-neutral-900 font-bold mb-2">
                  ⚠️ Importante
                </p>
                <p className="text-sm text-neutral-700">
                  Una vez realizada la transferencia, <strong>deberás enviar el comprobante de pago por WhatsApp</strong> al número <strong>+54 9 11 1234-5678</strong> con tu número de pedido para confirmar tu compra.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div>
            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-300">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-neutral-700">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-bold text-neutral-900">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-300">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
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
                type="submit"
                className="w-full bg-neutral-900 text-white px-6 py-4 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Confirmar Pedido
              </button>

              <p className="text-xs text-neutral-600 text-center mt-4">
                Al confirmar aceptás nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
