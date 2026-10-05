import React from "react";
import Button from "../common/Button";

export default function ReceiptModal({ isOpen, onClose, items, totals, cashierInfo }) {
  if (!isOpen) return null;

  const ticketNumber = "TK-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#006948] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span className="font-display font-bold text-sm tracking-wide">Comprobante de Caja</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Cuerpo del Ticket Imprimible */}
        <div className="p-6 overflow-y-auto flex flex-col font-mono text-xs text-[#131b2e] gap-4" id="printable-ticket">
          {/* Membrete Supermercado */}
          <div className="text-center pb-3 border-b border-dashed border-[#bccac0]">
            <h2 className="font-display font-bold text-xl text-[#006948]">SUPERMARKET OS</h2>
            <p className="text-[11px] text-[#6d7a72]">RUC: 1790012345001</p>
            <p className="text-[11px] text-[#6d7a72]">Sucursal Central &bull; Matriz</p>
            <p className="text-[11px] font-bold text-[#131b2e] mt-1">{ticketNumber}</p>
            <p className="text-[10px] text-[#6d7a72]">{now}</p>
          </div>

          {/* Datos del Cajero y Turno */}
          <div className="flex justify-between py-1 text-[11px] border-b border-dashed border-[#bccac0]">
            <span>Operador: <strong>{cashierInfo?.name || "Cajero"}</strong></span>
            <span>ID: <strong>{cashierInfo?.employeeId || "EMP-001"}</strong></span>
          </div>

          {/* Lista de Items */}
          <div className="flex flex-col gap-2 py-1">
            <div className="flex justify-between font-bold text-[11px] text-[#6d7a72]">
              <span>CANT &bull; DESCRIPCIÓN</span>
              <span>TOTAL</span>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div className="flex-1 pr-2">
                  <span className="font-bold">{item.quantity}x</span> {item.name}
                  <div className="text-[10px] text-[#6d7a72]">@ ${item.price.toFixed(2)} c/u</div>
                </div>
                <span className="font-bold">${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="border-t border-dashed border-[#bccac0] pt-3 flex flex-col gap-1 text-[12px]">
            <div className="flex justify-between text-[#6d7a72]">
              <span>SUBTOTAL:</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#6d7a72]">
              <span>IVA (15%):</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-[#006948] font-bold">
                <span>DESC. PUNTOS FRESH:</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-[#131b2e] border-t border-[#131b2e] pt-1 mt-1">
              <span>TOTAL PAGADO:</span>
              <span>${totals.total.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Código QR de Facturación Electrónica */}
          <div className="flex flex-col items-center justify-center pt-2 text-center">
            <div className="p-2 border border-[#bccac0] rounded-lg bg-[#faf8ff] inline-block mb-1">
              <span className="material-symbols-outlined text-[48px] text-[#131b2e]">qr_code_2</span>
            </div>
            <p className="text-[10px] text-[#6d7a72]">Autorización SRI / Hash Electrónico</p>
            <p className="text-[9px] text-[#006948] font-bold mt-1">
              ¡GRACIAS POR SU COMPRA!
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-[#f2f3ff] p-4 border-t border-[#e2e7ff] flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" fullWidth onClick={handlePrint} icon="print">
            Imprimir Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
