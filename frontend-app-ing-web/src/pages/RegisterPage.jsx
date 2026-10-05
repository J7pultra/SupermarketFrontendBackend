import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/common/Button";
import AlertBanner from "../components/common/AlertBanner";
import PasswordValidator from "../components/auth/PasswordValidator";
import RoleSelectorCards from "../components/auth/RoleSelectorCards";
import EmployeeIdField from "../components/auth/EmployeeIdField";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("CLIENTE");
  const [employeeId, setEmployeeId] = useState("EMP-001");
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "CLIENTE") {
      setEmployeeId("");
    } else if (!employeeId) {
      setEmployeeId("EMP-001");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validaciones locales rápidas
    if (name.trim().length < 2) {
      setErrorMessage("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage(
        "La contraseña no cumple con los requisitos mínimos (8 caracteres, 1 mayúscula y 1 número)."
      );
      return;
    }

    if ((role === "CAJERO" || role === "ADMIN") && !employeeId.trim()) {
      setErrorMessage("El ID de Empleado es obligatorio para cajeros y administradores.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Debes aceptar los términos y condiciones del programa.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      employeeId: role === "CLIENTE" ? null : employeeId.trim(),
    };

    const result = await register(payload);

    if (result.success) {
      setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setErrorMessage(result.error || "Error al registrar la cuenta.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-xl border border-[#e2e7ff] p-6 sm:p-8 flex flex-col gap-6">
        {/* Cabecera */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006948] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
            </div>
            <span className="font-mono text-xs text-[#006948] font-bold uppercase tracking-wider">
              POST /api/auth/register
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#131b2e] mt-1">
            Crear Cuenta de Supermarket
          </h1>
          <p className="text-sm text-[#6d7a72]">
            Regístrate como comprador o empleado para acceder al sistema unificado.
          </p>
        </div>

        {/* Mensajes de Alerta */}
        {errorMessage && (
          <AlertBanner
            type="error"
            title="Error de Validación (400)"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
        {successMessage && (
          <AlertBanner
            type="success"
            title="Registro Exitoso"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre Completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#131b2e] flex items-center justify-between" htmlFor="name">
              <span>Nombre Completo</span>
              <span className="text-xs text-[#6d7a72]">Mínimo 2 caracteres</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[20px] pointer-events-none">
                person
              </span>
              <input
                id="name"
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-sm placeholder:text-[#6d7a72]/60 border border-transparent focus:border-[#006948] focus:bg-white focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#131b2e]" htmlFor="reg-email">
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[20px] pointer-events-none">
                alternate_email
              </span>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan.perez@supermercado.com"
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-sm placeholder:text-[#6d7a72]/60 border border-transparent focus:border-[#006948] focus:bg-white focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#131b2e]" htmlFor="reg-password">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[20px] pointer-events-none">
                lock
              </span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña segura"
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
            {/* Validador dinámico de requisitos */}
            <PasswordValidator password={password} />
          </div>

          {/* Selector de Rol */}
          <RoleSelectorCards selectedRole={role} onSelectRole={handleRoleChange} />

          {/* Campo Condicional de Employee ID */}
          <EmployeeIdField
            role={role}
            value={employeeId}
            onChange={setEmployeeId}
          />

          {/* Términos y Condiciones */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-[#006948] focus:ring-[#85f8c4] border-[#bccac0]"
            />
            <label htmlFor="terms" className="text-xs text-[#3d4a42] leading-relaxed cursor-pointer select-none">
              Acepto los términos de servicio, acumulación de{" "}
              <span className="text-[#006948] font-bold">Puntos Fresh</span> de fidelidad y la política de
              seguridad de datos de Supermarket OS.
            </label>
          </div>

          {/* Botón de Registro */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            iconRight="arrow_forward"
            className="mt-2"
          >
            Crear Cuenta
          </Button>
        </form>

        {/* Pie de Enlace a Login */}
        <div className="border-t border-[#e2e7ff] pt-4 text-center">
          <p className="text-sm text-[#6d7a72]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-[#006948] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Inicia sesión aquí</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
