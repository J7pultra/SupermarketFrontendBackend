import React from "react";
import ApiHealthPill from "../components/common/ApiHealthPill";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Luces de ambiente sutiles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#006948]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#4648d4]/10 blur-3xl pointer-events-none" />

      {/* Barra superior flotante con indicador de servidor */}
      <div className="w-full max-w-[480px] mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#006948] text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-[#131b2e]">
            Supermarket <span className="text-[#006948]">OS</span>
          </span>
        </div>
        <ApiHealthPill />
      </div>

      {/* Contenedor de Formulario */}
      <main className="w-full max-w-[480px] z-10">{children}</main>

      {/* Pie de página discreto */}
      <footer className="mt-8 text-center text-xs text-[#6d7a72] font-mono">
        SupermarketApi &bull; Spring Boot 3 &bull; React 19 &bull; RBAC
      </footer>
    </div>
  );
}
