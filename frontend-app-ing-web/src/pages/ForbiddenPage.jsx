import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import Button from "../components/common/Button";
import RoleBadge from "../components/common/RoleBadge";

export default function ForbiddenPage() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requiredRoles = location.state?.requiredRoles || ["CAJERO", "ADMIN"];

  const handleSwitchAccount = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Luces de ambiente sutiles */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[#ba1a1a]/10 blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-[#ffdad6] p-6 sm:p-8 flex flex-col items-center text-center gap-6 z-10">
        {/* Icono de Seguridad Bloqueada */}
        <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[36px]">gpp_bad</span>
        </div>

        {/* Textos de Estado */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ba1a1a] bg-[#ffdad6]/60 px-3 py-1 rounded-full self-center">
            HTTP 403 Forbidden
          </span>
          <h1 className="font-display font-bold text-2xl text-[#131b2e] mt-2">
            Acceso Denegado por Seguridad
          </h1>
          <p className="text-sm text-[#6d7a72] max-w-md leading-relaxed">
            No tienes los permisos necesarios para realizar esta acción. Esta sección del supermercado está
            reservada exclusivamente para personal autorizado.
          </p>
        </div>

        {/* Detalle Técnico de RBAC */}
        <div className="w-full bg-[#faf8ff] rounded-xl p-4 border border-[#e2e7ff] text-xs font-mono flex flex-col gap-2 text-left">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e7ff]">
            <span className="text-[#6d7a72]">Tu Rol Activo:</span>
            <RoleBadge role={role} size="sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6d7a72]">Roles Requeridos:</span>
            <div className="flex gap-1">
              {requiredRoles.map((r) => (
                <span key={r} className="bg-[#f2f3ff] text-[#4648d4] font-bold px-2 py-0.5 rounded">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Button
            variant="outline"
            fullWidth
            onClick={handleSwitchAccount}
            icon="switch_account"
          >
            Cambiar Cuenta
          </Button>

          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate("/profile")}
            icon="arrow_back"
          >
            Volver a Mi Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
