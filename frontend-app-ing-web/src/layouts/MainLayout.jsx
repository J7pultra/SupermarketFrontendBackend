import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import ApiHealthPill from "../components/common/ApiHealthPill";
import RoleBadge from "../components/common/RoleBadge";

export default function MainLayout({ children }) {
  const { user, role, isAdmin, isCashier, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/profile", label: "Mi Perfil & Puntos", icon: "badge", visible: true },
    { to: "/cashier", label: "Terminal POS Caja", icon: "point_of_sale", visible: isCashier || isAdmin },
    { to: "/admin", label: "Consola Admin", icon: "admin_panel_settings", visible: isAdmin },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e7ff] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo y Marca */}
          <div className="flex items-center gap-6">
            <Link to="/profile" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#006948] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">storefront</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight tracking-tight text-[#131b2e]">
                  Supermarket <span className="text-[#006948]">OS</span>
                </span>
                <span className="text-[10px] font-mono text-[#6d7a72] -mt-0.5">Fresh Market Ops</span>
              </div>
            </Link>

            {/* Navegación por Roles */}
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {navLinks
                .filter((item) => item.visible)
                .map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#eaedff] text-[#006948] font-semibold shadow-xs"
                          : "text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Estado de Salud, Usuario & Acciones */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ApiHealthPill />
            </div>

            <div className="h-6 w-px bg-[#e2e7ff] hidden sm:block" />

            {/* Datos de Usuario */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-[#131b2e] leading-tight truncate max-w-[150px]">
                  {user?.name || "Usuario"}
                </div>
                <div className="text-xs text-[#6d7a72] truncate max-w-[150px] font-mono">
                  {user?.email}
                </div>
              </div>

              <RoleBadge role={role} size="sm" />

              {/* Botón Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg text-[#6d7a72] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra móvil para pantallas pequeñas */}
        <div className="md:hidden flex items-center justify-around border-t border-[#e2e7ff] py-1 bg-[#f2f3ff]/60 px-2">
          {navLinks
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                    isActive ? "bg-white text-[#006948] font-bold shadow-xs" : "text-[#3d4a42]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-[#e2e7ff] py-6 text-center text-xs text-[#6d7a72] bg-white">
        <p>&copy; 2026 Supermarket OS &bull; Sistema Integrado de Retail con Control RBAC</p>
      </footer>
    </div>
  );
}
