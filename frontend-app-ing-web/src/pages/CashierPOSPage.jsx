import React, { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import cashierApi from "../api/cashierApi";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/common/Button";
import AlertBanner from "../components/common/AlertBanner";
import ReceiptModal from "../components/pos/ReceiptModal";

const AVAILABLE_PRODUCTS = [
  { id: "P-101", name: "Leche Entera 1L", category: "Lácteos", price: 1.25, barcode: "7861001201" },
  { id: "P-102", name: "Manzanas Rojas (Kg)", category: "Frutas", price: 2.4, barcode: "7861001202" },
  { id: "P-103", name: "Pan Integral de Molde", category: "Panadería", price: 2.1, barcode: "7861001203" },
  { id: "P-104", name: "Aceite Vegetal 900ml", category: "Abarrotes", price: 3.25, barcode: "7861001204" },
  { id: "P-105", name: "Arroz Flor Extra 1Kg", category: "Granos", price: 1.5, barcode: "7861001205" },
  { id: "P-106", name: "Café Molido 250g", category: "Bebidas", price: 4.8, barcode: "7861001206" },
];

export default function CashierPOSPage() {
  const { user } = useAuth();
  const [apiStatusMessage, setApiStatusMessage] = useState("");
  const [error, setError] = useState("");

  const [cart, setCart] = useState([
    { id: "P-101", name: "Leche Entera 1L", price: 1.25, quantity: 2 },
    { id: "P-102", name: "Manzanas Rojas (Kg)", price: 2.4, quantity: 1 },
  ]);

  const [applyPointsDiscount, setApplyPointsDiscount] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function verifyCashierArea() {
      try {
        const res = await cashierApi.getCashierArea();
        // res: { message: "Área de facturación y validación" }
        setApiStatusMessage(res.message);
      } catch (err) {
        setError(err.message || "Error al verificar permisos en /api/auth/cashier-area");
      }
    }

    verifyCashierArea();
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Cálculos financieros
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.15; // IVA 15%
  const discount = applyPointsDiscount ? Math.min(subtotal, 1.5) : 0; // Descuento de $1.50 con puntos
  const total = Math.max(0, subtotal + tax - discount);

  const filteredProducts = AVAILABLE_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Cabecera de la Terminal POS */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2e7ff] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#ffddb8] text-[#825100] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[28px]">point_of_sale</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-[#131b2e]">
                  Terminal de Facturación POS
                </h1>
                <span className="bg-[#ffddb8] text-[#2a1700] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                  CAJA #04
                </span>
              </div>
              <p className="text-xs text-[#6d7a72] font-mono mt-0.5">
                GET /api/auth/cashier-area &bull;{" "}
                <span className="text-[#006948] font-bold">
                  {apiStatusMessage || "Área de facturación validada"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#f2f3ff] px-4 py-2 rounded-xl border border-[#e2e7ff]">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#6d7a72] block">Cajero Operador</span>
              <span className="text-xs font-bold text-[#131b2e]">{user?.name || "Cajero Turno"}</span>
            </div>
            <span className="bg-[#006948] text-white text-xs font-mono font-bold px-2 py-1 rounded">
              {user?.employeeId || "EMP-001"}
            </span>
          </div>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError("")} />}

        {/* Layout Principal: 2 Columnas (Catálogo + Carrito/Totales) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Escaneo & Búsqueda de Productos (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Buscador / Lector de Códigos de Barra */}
            <div className="bg-white rounded-2xl p-4 border border-[#e2e7ff] shadow-sm flex flex-col gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] text-[22px]">
                  barcode_scanner
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escanear código de barras o buscar producto (ej. Leche, Frutas)..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#6d7a72] border border-transparent focus:border-[#006948] focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#6d7a72] font-mono px-1">
                <span>Catálogo Rápido de Supermercado</span>
                <span>{filteredProducts.length} productos listados</span>
              </div>
            </div>

            {/* Grid de Productos Rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddToCart(p)}
                  className="bg-white rounded-xl p-3.5 border border-[#e2e7ff] hover:border-[#006948] hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[110px] group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-[#825100] bg-[#fffbeb] px-1.5 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className="material-symbols-outlined text-[#bccac0] group-hover:text-[#006948] text-[20px] transition-colors">
                      add_circle
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#131b2e] leading-snug line-clamp-2">
                      {p.name}
                    </h4>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-mono text-sm font-bold text-[#006948]">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-mono text-[#6d7a72]">{p.barcode}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Detalle de Orden Actual & Totales (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e2e7ff] shadow-sm flex flex-col overflow-hidden sticky top-24">
            {/* Header del Ticket */}
            <div className="p-4 bg-[#f2f3ff] border-b border-[#e2e7ff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006948] text-[20px]">shopping_cart</span>
                <span className="font-display font-bold text-sm text-[#131b2e]">
                  Venta en Curso ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs font-mono text-[#ba1a1a] hover:underline"
                >
                  Vaciar
                </button>
              )}
            </div>

            {/* Lista de Items en Caja */}
            <div className="p-4 flex flex-col gap-2 max-h-[320px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-[#6d7a72]">
                  <span className="material-symbols-outlined text-[40px] text-[#bccac0] mb-2">
                    production_quantity_limits
                  </span>
                  <p className="text-xs font-semibold">El carrito de caja está vacío</p>
                  <p className="text-[11px] mt-0.5">Haz clic en un producto para agregarlo.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e7ff]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#131b2e] truncate">{item.name}</p>
                      <p className="text-[11px] font-mono text-[#6d7a72]">
                        ${item.price.toFixed(2)} c/u &bull; Subtotal:{" "}
                        <strong className="text-[#131b2e]">${(item.price * item.quantity).toFixed(2)}</strong>
                      </p>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#bccac0] text-[#131b2e] flex items-center justify-center hover:bg-[#eaedff] font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#bccac0] text-[#131b2e] flex items-center justify-center hover:bg-[#eaedff] font-bold text-sm"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#6d7a72] hover:text-[#ba1a1a] p-1 ml-1"
                        title="Eliminar de la lista"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totalizador Financiero */}
            <div className="p-4 bg-[#faf8ff] border-t border-[#e2e7ff] flex flex-col gap-2.5">
              {/* Opción de canjear puntos de lealtad */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#ecfdf5] border border-[#10b981]/30 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={applyPointsDiscount}
                    onChange={(e) => setApplyPointsDiscount(e.target.checked)}
                    className="rounded text-[#006948] focus:ring-[#85f8c4]"
                  />
                  <span className="font-semibold text-[#065f46]">Canjear 150 Puntos Fresh (-$1.50)</span>
                </label>
                <span className="font-mono font-bold text-[#006948]">PROMO</span>
              </div>

              {/* Subtotales */}
              <div className="flex flex-col gap-1 text-xs font-mono text-[#6d7a72] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal Neto:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (15%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {applyPointsDiscount && (
                  <div className="flex justify-between text-[#006948] font-bold">
                    <span>Descuento Puntos:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#131b2e] border-t border-[#e2e7ff] pt-2 mt-1">
                  <span>Total a Cobrar:</span>
                  <span className="text-[#006948] text-xl font-display font-bold">
                    ${total.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Botón de Cobro */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={cart.length === 0}
                onClick={() => setIsReceiptOpen(true)}
                icon="payments"
                className="mt-2"
              >
                Cobrar & Emitir Ticket (F12)
              </Button>
            </div>
          </div>
        </div>

        {/* Modal de Comprobante / Ticket Imprimible */}
        <ReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => {
            setIsReceiptOpen(false);
            handleClearCart();
          }}
          items={cart}
          totals={{ subtotal, tax, discount, total }}
          cashierInfo={{ name: user?.name, employeeId: user?.employeeId }}
        />
      </div>
    </MainLayout>
  );
}
