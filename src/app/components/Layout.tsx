import { Outlet, Link } from "react-router";
import { ShoppingCart, Menu } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button className="p-2 hover:bg-neutral-100 rounded-lg lg:hidden">
            <Menu className="w-6 h-6 text-neutral-700" />
          </button>

          <Link to="/" className="text-2xl font-bold text-neutral-900">
            ECOMMERCE
          </Link>

          <Link to="/carrito" className="p-2 hover:bg-neutral-100 rounded-lg relative">
            <ShoppingCart className="w-6 h-6 text-neutral-700" />
            <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">ECOMMERCE</h3>
              <p className="text-sm">Tu tienda online de confianza</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/productos" className="hover:text-white">Productos</Link></li>
                <li><Link to="/" className="hover:text-white">Categorías</Link></li>
                <li><Link to="/" className="hover:text-white">Ayuda</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contacto</h4>
              <p className="text-sm">Email: info@ecommerce.com</p>
              <p className="text-sm">WhatsApp: +54 9 11 1234-5678</p>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-8 pt-8 text-sm text-center">
            © 2026 Ecommerce. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
