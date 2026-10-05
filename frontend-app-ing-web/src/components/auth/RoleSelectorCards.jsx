import React from "react";

export default function RoleSelectorCards({ selectedRole, onSelectRole }) {
  const roles = [
    {
      id: "CLIENTE",
      name: "Cliente",
      tag: "Público",
      desc: "Puntos Fresh & Compras",
      icon: "shopping_cart",
      activeBg: "bg-[#ecfdf5] border-[#10b981] text-[#006948] ring-2 ring-[#85f8c4]",
      badgeClass: "bg-[#85f8c4] text-[#002114]",
    },
    {
      id: "CAJERO",
      name: "Cajero",
      tag: "Empleado",
      desc: "Terminal POS & Facturación",
      icon: "point_of_sale",
      activeBg: "bg-[#fffbeb] border-[#f59e0b] text-[#825100] ring-2 ring-[#ffddb8]",
      badgeClass: "bg-[#ffddb8] text-[#2a1700]",
    },
    {
      id: "ADMIN",
      name: "Admin",
      tag: "Gerencia",
      desc: "Gestión total & Auditoría",
      icon: "shield_person",
      activeBg: "bg-[#eef2ff] border-[#6366f1] text-[#4648d4] ring-2 ring-[#e1e0ff]",
      badgeClass: "bg-[#e1e0ff] text-[#07006c]",
    },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
          Seleccionar Rol de Usuario
        </label>
        <span className="text-[10px] font-mono text-[#6d7a72]">RBAC Control</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1.5 relative ${
                isSelected
                  ? r.activeBg
                  : "bg-white border-[#e2e7ff] text-[#131b2e] hover:bg-[#f2f3ff]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase ${r.badgeClass}`}
                >
                  {r.tag}
                </span>
              </div>
              <div>
                <p className="font-bold text-xs leading-none">{r.name}</p>
                <p className="text-[10px] text-[#6d7a72] mt-0.5 leading-tight">{r.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
