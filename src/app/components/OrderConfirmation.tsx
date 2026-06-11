import { Link, useParams } from "react-router";
import { CheckCircle2, Package, Truck, Home as HomeIcon, MessageCircle } from "lucide-react";

export default function OrderConfirmation() {
  const { orderId } = useParams();

  const orderSteps = [
    {
      status: "completed",
      label: "Pedido recibido",
      icon: CheckCircle2,
      description: "Tu pedido ha sido registrado correctamente",
    },
    {
      status: "current",
      label: "Pendiente de pago",
      icon: MessageCircle,
      description: "Esperando comprobante de transferencia",
    },
    {
      status: "pending",
      label: "En preparación",
      icon: Package,
      description: "Preparando tu pedido para envío",
    },
    {
      status: "pending",
      label: "En camino",
      icon: Truck,
      description: "Tu pedido está en camino",
    },
    {
      status: "pending",
      label: "Entregado",
      icon: HomeIcon,
      description: "Pedido entregado con éxito",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Confirmación */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          ¡Pedido Confirmado!
        </h1>

        <p className="text-lg text-neutral-700 mb-2">
          Tu número de pedido es: <strong>#{orderId}</strong>
        </p>

        <p className="text-neutral-600">
          Hemos enviado los detalles a tu email
        </p>
      </div>

      {/* Instrucciones de pago */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <MessageCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">
              Siguiente paso: Enviar comprobante de pago
            </h2>
            <p className="text-neutral-700 mb-4">
              Para confirmar tu compra, debes enviar el comprobante de transferencia bancaria por WhatsApp.
            </p>

            <div className="bg-white border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-neutral-700 mb-2">
                <strong>Datos bancarios:</strong>
              </p>
              <div className="text-sm text-neutral-700 space-y-1">
                <p>Banco: Banco Ejemplo</p>
                <p>Titular: Ecommerce SA</p>
                <p>CBU: 1234567890123456789012</p>
                <p>Alias: TIENDA.ONLINE</p>
              </div>
            </div>

            <a
              href={`https://wa.me/5491112345678?text=Hola! Adjunto comprobante de pago del pedido #${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar por WhatsApp
            </a>

            <p className="text-sm text-neutral-600 mt-3">
              Incluí tu número de pedido: <strong>#{orderId}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Estados del pedido */}
      <div className="bg-white border-2 border-neutral-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Estado de tu Pedido
        </h2>

        <div className="space-y-6">
          {orderSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div key={index} className="relative">
                {index < orderSteps.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-12 ${
                      isCompleted ? "bg-neutral-900" : "bg-neutral-300"
                    }`}
                  />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-neutral-900 text-white"
                        : isCurrent
                        ? "bg-yellow-100 text-yellow-600 border-2 border-yellow-300"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 pt-2">
                    <h3
                      className={`font-bold mb-1 ${
                        isCompleted || isCurrent ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p
                      className={`text-sm ${
                        isCompleted || isCurrent ? "text-neutral-600" : "text-neutral-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-neutral-900 mt-3" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-white border-2 border-neutral-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Resumen de Compra
        </h2>

        <div className="space-y-3 pb-4 border-b border-neutral-300 mb-4">
          <div className="flex justify-between text-neutral-700">
            <span>Producto Premium 1 x2</span>
            <span className="font-bold">$5.998</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>Producto 2 x1</span>
            <span className="font-bold">$4.599</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>Producto 3 x3</span>
            <span className="font-bold">$5.697</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-neutral-700">
            <span>Subtotal</span>
            <span className="font-bold">$16.294</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>Envío</span>
            <span className="font-bold text-green-600">Gratis</span>
          </div>
        </div>

        <div className="flex justify-between text-xl font-bold text-neutral-900 pt-4 border-t border-neutral-300">
          <span>Total</span>
          <span>$16.294</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="flex-1 text-center bg-neutral-900 text-white px-6 py-4 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          to="/productos"
          className="flex-1 text-center border-2 border-neutral-300 text-neutral-900 px-6 py-4 rounded-lg hover:border-neutral-900 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
