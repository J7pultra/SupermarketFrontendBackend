import React from "react";

export default function EmployeeIdField({ role, value, onChange, error }) {
  const isEmployee = role === "CAJERO" || role === "ADMIN";

  if (!isEmployee) return null;

  return (
    <div className="bg-[#fffbeb] border border-[#f59e0b]/40 rounded-lg p-3 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#825100]">
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            ID de Empleado Obligatorio <span className="text-[#ba1a1a]">*</span>
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold bg-[#ffddb8] text-[#2a1700] px-1.5 py-0.5 rounded">
          {role} ONLY
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Ej: EMP-001"
          required
          className="w-full h-10 px-3 rounded-md bg-white border border-[#e2e7ff] font-mono text-sm font-semibold uppercase text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] shadow-xs"
        />
      </div>

      <div className="flex items-start gap-1 text-[#653e00] text-[11px] leading-tight">
        <span className="material-symbols-outlined text-[14px] flex-shrink-0 mt-0.5">info</span>
        <span>Requerido por Spring Boot para personal interno de tienda (Cajeros y Administradores).</span>
      </div>

      {error && <span className="text-[#ba1a1a] text-xs font-semibold">{error}</span>}
    </div>
  );
}
