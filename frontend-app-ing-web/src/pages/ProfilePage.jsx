import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import authApi from "../api/authApi";
import MainLayout from "../layouts/MainLayout";
import RoleBadge from "../components/common/RoleBadge";
import Button from "../components/common/Button";
import LoyaltyPointsCard from "../components/profile/LoyaltyPointsCard";
import AlertBanner from "../components/common/AlertBanner";

export default function ProfilePage() {
  const { user, role, isAdmin, isCashier, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await authApi.getProfile();
        // data: { message: "Perfil de usuario", user: { userId: "...", role: "..." } }
        setProfileData(data);
      } catch (err) {
        setError(err.message || "No se pudo sincronizar el perfil con el backend.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const userId = profileData?.user?.userId || user?.id || "N/A";

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        {/* Cabecera de Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e7ff] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#006948] font-bold uppercase tracking-wider">
                GET /api/auth/profile
              </span>
              <span className="text-[#6d7a72]">&bull;</span>
              <span className="text-xs font-mono text-[#006948] font-medium">Autenticación Bearer</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-[#131b2e]">
              Mi Cuenta & Fidelización
            </h1>
            <p className="text-sm text-[#6d7a72] mt-0.5">
              Bienvenido de nuevo, <strong className="text-[#131b2e]">{user?.name || "Usuario"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RoleBadge role={role} size="md" />
            {user?.employeeId && (
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#ffddb8] text-[#2a1700] border border-[#f59e0b]/40">
                {user.employeeId}
              </span>
            )}
          </div>
        </div>

        {error && <AlertBanner type="warning" message={error} onClose={() => setError("")} />}

        {/* Tarjeta de Lealtad y Puntos */}
        <LoyaltyPointsCard points={user?.loyaltyPoints || 450} userName={user?.name} />

        {/* Grilla de Datos de Cuenta y Permisos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identidad del Usuario */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e7ff] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#eaedff] text-[#006948] font-display font-bold text-xl flex items-center justify-center border border-[#bccac0]/30 shadow-xs">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg text-[#131b2e] truncate">
                  {user?.name || "Usuario"}
                </h3>
                <p className="text-xs text-[#6d7a72] font-mono truncate">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-[#f2f3ff] pt-4 flex flex-col gap-3">
              <div>
                <span className="text-xs font-mono text-[#6d7a72] uppercase block mb-1">
                  ID de Usuario (UUID PK):
                </span>
                <div className="flex items-center gap-2 bg-[#f2f3ff] p-2 rounded-lg border border-[#e2e7ff]">
                  <span className="font-mono text-xs text-[#131b2e] truncate flex-1">{userId}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-xs font-mono font-semibold px-2 py-1 rounded bg-white hover:bg-[#eaedff] text-[#006948] border border-[#bccac0]/40 transition-colors"
                  >
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#faf8ff] p-3 rounded-lg border border-[#e2e7ff]">
                  <span className="text-[11px] font-mono text-[#6d7a72] uppercase block">Rol Asignado</span>
                  <span className="text-sm font-bold text-[#131b2e]">{role || "CLIENTE"}</span>
                </div>
                <div className="bg-[#faf8ff] p-3 rounded-lg border border-[#e2e7ff]">
                  <span className="text-[11px] font-mono text-[#6d7a72] uppercase block">Estado Cuenta</span>
                  <span className="text-sm font-bold text-[#006948] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#006948] inline-block" />
                    Activa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos según Rol */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e7ff] shadow-sm flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#4648d4]">
                <span className="material-symbols-outlined text-[22px]">hub</span>
                <h3 className="font-display font-bold text-lg text-[#131b2e]">
                  Módulos Autorizados (RBAC)
                </h3>
              </div>
              <p className="text-xs text-[#6d7a72] leading-relaxed mb-4">
                El backend de Spring Boot 3 restringe el acceso según tu nivel de autorización JWT.
                A continuación se muestran los entornos habilitados para tu usuario:
              </p>

              <div className="flex flex-col gap-2.5">
                {(isCashier || isAdmin) && (
                  <Link
                    to="/cashier"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#fffbeb] border border-[#f59e0b]/30 hover:border-[#f59e0b] hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#ffddb8] text-[#825100] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#131b2e] group-hover:text-[#825100]">
                          Terminal de Facturación POS
                        </p>
                        <p className="text-xs text-[#6d7a72]">Área de cobro de cajeros</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#825100] text-[20px] group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#eef2ff] border border-[#6366f1]/30 hover:border-[#6366f1] hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#131b2e] group-hover:text-[#4648d4]">
                          Consola Administrativa
                        </p>
                        <p className="text-xs text-[#6d7a72]">Gestión de empleados y métricas</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#4648d4] text-[20px] group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </Link>
                )}

                {!isCashier && !isAdmin && (
                  <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#e2e7ff] text-center">
                    <span className="material-symbols-outlined text-[#006948] text-[28px] mb-1">
                      shopping_basket
                    </span>
                    <p className="text-xs font-semibold text-[#131b2e]">Catálogo de Autoservicio</p>
                    <p className="text-[11px] text-[#6d7a72] mt-0.5">
                      Tus compras acumulan automáticamente puntos canjeables en cada visita.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#f2f3ff] pt-3 flex justify-between items-center text-xs font-mono text-[#6d7a72]">
              <span>JWT Bearer Activo</span>
              <span className="text-[#006948] font-bold">24 Horas TTL</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
