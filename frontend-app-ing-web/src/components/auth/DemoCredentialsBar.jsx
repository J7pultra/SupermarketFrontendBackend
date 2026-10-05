import React from "react";

export default function DemoCredentialsBar({ onSelect }) {
  const accounts = [
    {
      role: "ADMIN",
      email: "admin@correo.com",
      password: "Password123",
      label: "ADMIN",
      icon: "shield_person",
      style: "hover:bg-[#e1e0ff] text-[#07006c]",
    },
    {
      role: "CAJERO",
      email: "cajero@correo.com",
      password: "Password123",
      label: "CAJERO",
      icon: "point_of_sale",
      style: "hover:bg-[#ffddb8] text-[#2a1700]",
    },
    {
      role: "CLIENTE",
      email: "cliente@correo.com",
      password: "Password123",
      label: "CLIENTE",
      icon: "shopping_bag",
      style: "hover:bg-[#85f8c4] text-[#002114]",
    },
  ];

  return (
    <div className="bg-[#f2f3ff] rounded-lg p-2.5 shadow-inner flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#3d4a42] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          <span>Credenciales Demo (RBAC)</span>
        </span>
        <span className="font-mono text-[10px] text-[#6d7a72] font-semibold">Auto-fill</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {accounts.map((acc) => (
          <button
            key={acc.role}
            type="button"
            onClick={() => onSelect(acc.email, acc.password, acc.role)}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-white font-mono text-xs font-semibold shadow-xs border border-[#bccac0]/50 transition-all ${acc.style}`}
            title={`Autocompletar con cuenta ${acc.role}`}
          >
            <span className="material-symbols-outlined text-[14px]">{acc.icon}</span>
            <span>{acc.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
