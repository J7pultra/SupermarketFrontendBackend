import React from "react";

export default function LoyaltyPointsCard({ points = 0, userName = "Cliente" }) {
  const pointsVal = Number(points) || 0;
  const cashEquivalent = (pointsVal * 0.01).toFixed(2);
  const nextTierPoints = 2000;
  const progressPercent = Math.min(100, Math.round((pointsVal / nextTierPoints) * 100));

  return (
    <div className="bg-gradient-to-br from-[#006948] via-[#005137] to-[#002114] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[280px]">
      {/* Patrones de fondo */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 rounded-full bg-[#85f8c4]/10 blur-xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#85f8c4] border border-white/20">
            <span className="material-symbols-outlined text-[24px]">stars</span>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg leading-tight">Supermarket Rewards</h3>
            <p className="text-xs text-[#85f8c4] font-mono">Programa de Fidelidad Fresh</p>
          </div>
        </div>

        <span className="bg-[#85f8c4] text-[#002114] font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Nivel Oro
        </span>
      </div>

      {/* Balance Central de Puntos */}
      <div className="my-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1">
            Puntos Fresh Disponibles
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white">
              {pointsVal.toLocaleString()}
            </span>
            <span className="font-mono text-sm text-[#85f8c4]">PTS</span>
          </div>
          <p className="text-xs text-white/80 mt-1">
            Equivalente a <strong className="text-white">${cashEquivalent} USD</strong> de descuento directo
            en caja.
          </p>
        </div>

        {/* Simulación de Código QR para Caja */}
        <div className="bg-white p-2.5 rounded-xl shadow-md flex flex-col items-center self-start sm:self-auto">
          <div className="w-20 h-20 bg-[#131b2e] rounded-lg flex items-center justify-center p-1">
            <div className="w-full h-full border-2 border-white border-dashed rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[32px]">qr_code_2</span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#131b2e] font-bold mt-1 uppercase">
            Escanear en Caja
          </span>
        </div>
      </div>

      {/* Barra de Progreso hacia el siguiente nivel */}
      <div className="z-10 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white/80">Meta Nivel Platino</span>
          <span className="text-[#85f8c4] font-bold">
            {pointsVal} / {nextTierPoints} PTS ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#85f8c4] to-[#68dba9] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
