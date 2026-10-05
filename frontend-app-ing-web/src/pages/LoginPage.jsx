import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/common/Button";
import AlertBanner from "../components/common/AlertBanner";
import DemoCredentialsBar from "../components/auth/DemoCredentialsBar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeRoleBadge, setActiveRoleBadge] = useState(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSelect = (demoEmail, demoPassword, role) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveRoleBadge(role);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Por favor ingresa tu correo y contraseña.");
      return;
    }

    const result = await login(email.trim(), password);

    if (result.success) {
      const userRole = result.user?.role?.toUpperCase();
      // Redirigir según el rol o según la ruta de origen
      const fromPath = location.state?.from?.pathname;
      if (fromPath && fromPath !== "/login") {
        navigate(fromPath, { replace: true });
      } else if (userRole === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (userRole === "CAJERO") {
        navigate("/cashier", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } else {
      setErrorMessage(result.error || "Credenciales inválidas. Compruebe el correo y contraseña.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-xl border border-[#e2e7ff] p-6 sm:p-8 flex flex-col gap-6">
        {/* Cabecera de la Tarjeta */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#85f8c4]/30 text-[#006948] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[28px]">local_grocery_store</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#131b2e]">
            Iniciar Sesión en Supermarket OS
          </h1>
          <p className="text-sm text-[#6d7a72] max-w-sm">
            Acceso unificado para Clientes, Cajeros y Personal Administrativo.
          </p>
        </div>

        {/* Alerta de Error (401 o validación) */}
        {errorMessage && (
          <AlertBanner
            type="error"
            title="HTTP 401 Unauthorized"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Correo Electrónico */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#131b2e] flex items-center justify-between" htmlFor="email">
              <span>Correo Electrónico</span>
              {activeRoleBadge && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#006948] font-bold uppercase">
                  {activeRoleBadge}
                </span>
              )}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[20px] pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setActiveRoleBadge(null);
                }}
                placeholder="ej. admin@correo.com o cliente@correo.com"
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-sm placeholder:text-[#6d7a72]/60 border border-transparent focus:border-[#006948] focus:bg-white focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#131b2e]" htmlFor="password">
                Contraseña
              </label>
              <span className="text-xs text-[#006948] font-medium">Spring Security BCrypt</span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[20px] pointer-events-none">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-sm placeholder:text-[#6d7a72]/60 border border-transparent focus:border-[#006948] focus:bg-white focus:outline-none transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#6d7a72] hover:text-[#131b2e] focus:outline-none"
                aria-label="Mostrar u ocultar contraseña"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Selector de Cuentas Demo de Stitch */}
          <DemoCredentialsBar onSelect={handleDemoSelect} />

          {/* Botón de Envío */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            iconRight="arrow_forward"
            className="mt-2"
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Pie de Enlace a Registro */}
        <div className="border-t border-[#e2e7ff] pt-4 text-center">
          <p className="text-sm text-[#6d7a72]">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-[#006948] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Regístrate aquí</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
