import React, { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import adminApi from "../api/adminApi";
import MainLayout from "../layouts/MainLayout";
import RoleBadge from "../components/common/RoleBadge";
import Button from "../components/common/Button";
import AlertBanner from "../components/common/AlertBanner";

export default function AdminConsolePage() {
  const { user } = useAuth();
  const [adminGreeting, setAdminGreeting] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personnel"); // personnel, telemetry

  const [employees, setEmployees] = useState([
    {
      id: "usr-01",
      name: "Administrador Central",
      email: "admin@correo.com",
      role: "ADMIN",
      employeeId: "EMP-000",
      status: "Activo",
      lastLogin: "Hace 5 minutos",
    },
    {
      id: "usr-02",
      name: "Carlos Mendoza",
      email: "carlos@super.com",
      role: "CAJERO",
      employeeId: "EMP-001",
      status: "En Caja #04",
      lastLogin: "Hace 12 minutos",
    },
    {
      id: "usr-03",
      name: "Ana Gómez",
      email: "ana.gomez@super.com",
      role: "CAJERO",
      employeeId: "EMP-002",
      status: "En Caja #02",
      lastLogin: "Hace 40 minutos",
    },
    {
      id: "usr-04",
      name: "Roberto Silva",
      email: "roberto@super.com",
      role: "CAJERO",
      employeeId: "EMP-003",
      status: "Inactivo (Turno Tarde)",
      lastLogin: "Ayer 18:30",
    },
  ]);

  useEffect(() => {
    async function verifyAdminArea() {
      try {
        const res = await adminApi.getAdminArea();
        // res: { message: "Bienvenido, Administrador" }
        setAdminGreeting(res.message);
      } catch (err) {
        setError(err.message || "Error al verificar privilegios en /api/auth/admin-only");
      }
    }

    verifyAdminArea();
  }, []);

  const kpis = [
    {
      label: "Usuarios Totales",
      val: "1,298",
      sub: "1,280 Clientes &bull; 18 Empleados",
      icon: "group",
      color: "text-[#006948]",
      bg: "bg-[#ecfdf5]",
    },
    {
      label: "Puntos Emitidos",
      val: "58,400",
      sub: "Equivale a $584.00 USD en compras",
      icon: "stars",
      color: "text-[#825100]",
      bg: "bg-[#fffbeb]",
    },
    {
      label: "Cajas Operativas",
      val: "4 / 8",
      sub: "Terminal POS activa en sucursal",
      icon: "point_of_sale",
      color: "text-[#4648d4]",
      bg: "bg-[#eef2ff]",
    },
    {
      label: "Backend Telemetría",
      val: "200 OK",
      sub: "Spring Boot 3 + H2 Database",
      icon: "dns",
      color: "text-[#006948]",
      bg: "bg-[#ecfdf5]",
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#c0c1ff] border border-white/20">
              <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#c0c1ff] font-bold uppercase tracking-wider">
                  GET /api/auth/admin-only
                </span>
                <span className="bg-[#4648d4] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  SOLO ADMIN
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl mt-1">
                {adminGreeting || "Consola de Mando Administrativo"}
              </h1>
              <p className="text-xs text-[#c0c1ff]/80 font-mono mt-0.5">
                Panel de gobernanza, auditoría de seguridad y gestión de personal minorista.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#85f8c4] text-[20px]">verified_user</span>
            <div className="text-xs font-mono">
              <span className="text-white/70 block">Sesión Autorizada:</span>
              <strong className="text-white">{user?.name}</strong>
            </div>
          </div>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError("")} />}

        {/* Grilla de Métricas KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#e2e7ff] shadow-sm flex items-start justify-between gap-3 hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-mono uppercase text-[#6d7a72] block">{k.label}</span>
                <h3 className="font-display font-bold text-2xl text-[#131b2e] mt-1">{k.val}</h3>
                <p
                  className="text-xs text-[#6d7a72] mt-1"
                  dangerouslySetInnerHTML={{ __html: k.sub }}
                />
              </div>
              <div className={`w-11 h-11 rounded-xl ${k.bg} ${k.color} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-[24px]">{k.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pestañas de Gestión */}
        <div className="bg-white rounded-2xl border border-[#e2e7ff] shadow-sm overflow-hidden flex flex-col">
          {/* Barra de Pestañas */}
          <div className="border-b border-[#e2e7ff] px-6 pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("personnel")}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "personnel"
                  ? "border-[#4648d4] text-[#4648d4]"
                  : "border-transparent text-[#6d7a72] hover:text-[#131b2e]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>Gestión de Personal & Roles</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("telemetry")}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "telemetry"
                  ? "border-[#4648d4] text-[#4648d4]"
                  : "border-transparent text-[#6d7a72] hover:text-[#131b2e]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span>Seguridad & JWT Endpoints</span>
            </button>
          </div>

          {/* Contenido: Personal */}
          {activeTab === "personnel" && (
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#131b2e]">
                    Personal Activo de Supermercado
                  </h3>
                  <p className="text-xs text-[#6d7a72]">
                    Todos los cajeros y administradores requieren un Employee ID único registrado en Spring Boot.
                  </p>
                </div>
              </div>

              {/* Tabla de Empleados */}
              <div className="overflow-x-auto border border-[#e2e7ff] rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#f2f3ff] text-[#3d4a42] uppercase border-b border-[#e2e7ff]">
                    <tr>
                      <th className="p-3.5">Nombre & Contacto</th>
                      <th className="p-3.5">Rol de Sistema</th>
                      <th className="p-3.5">Employee ID</th>
                      <th className="p-3.5">Estado Operativo</th>
                      <th className="p-3.5">Último Ingreso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e7ff]">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#faf8ff] transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-[#131b2e] text-sm font-sans">{emp.name}</p>
                          <p className="text-[#6d7a72]">{emp.email}</p>
                        </td>
                        <td className="p-3.5">
                          <RoleBadge role={emp.role} size="sm" />
                        </td>
                        <td className="p-3.5">
                          <span className="bg-[#faf8ff] border border-[#bccac0] px-2 py-1 rounded font-bold text-[#131b2e]">
                            {emp.employeeId}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              emp.status.includes("Activo") || emp.status.includes("Caja")
                                ? "text-[#006948]"
                                : "text-[#6d7a72]"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                emp.status.includes("Activo") || emp.status.includes("Caja")
                                  ? "bg-[#006948]"
                                  : "bg-[#6d7a72]"
                              }`}
                            />
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#6d7a72]">{emp.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contenido: Telemetría & Seguridad */}
          {activeTab === "telemetry" && (
            <div className="p-6 flex flex-col gap-4 font-mono text-xs">
              <h3 className="font-display font-bold text-lg text-[#131b2e]">
                Inspección de Seguridad & RBAC
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#e2e7ff] flex flex-col gap-2">
                  <span className="font-bold text-[#4648d4] text-sm">Contratos de Seguridad Spring Boot</span>
                  <ul className="list-disc list-inside text-[#3d4a42] space-y-1">
                    <li>Algoritmo JWT: <strong>HMAC-SHA256 (HS256)</strong></li>
                    <li>Claim Principal: <strong>subject = user_uuid</strong></li>
                    <li>Claim de Autorización: <strong>role = ROLE_ADMIN</strong></li>
                    <li>Vigencia del Token: <strong>86,400,000 ms (24h)</strong></li>
                  </ul>
                </div>

                <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#e2e7ff] flex flex-col gap-2">
                  <span className="font-bold text-[#006948] text-sm">Validación de Rutas Protegidas</span>
                  <div className="space-y-1.5 text-[#3d4a42]">
                    <div className="flex justify-between border-b border-[#e2e7ff] pb-1">
                      <span>/api/auth/register</span>
                      <strong className="text-[#006948]">PÚBLICO (201)</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#e2e7ff] pb-1">
                      <span>/api/auth/login</span>
                      <strong className="text-[#006948]">PÚBLICO (200)</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#e2e7ff] pb-1">
                      <span>/api/auth/profile</span>
                      <strong className="text-[#4648d4]">AUTHENTICATED</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#e2e7ff] pb-1">
                      <span>/api/auth/cashier-area</span>
                      <strong className="text-[#825100]">ADMIN + CAJERO</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>/api/auth/admin-only</span>
                      <strong className="text-[#4648d4]">SOLO ADMIN</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
