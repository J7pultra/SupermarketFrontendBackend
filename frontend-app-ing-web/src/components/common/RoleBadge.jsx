import React from "react";

export default function RoleBadge({ role, size = "md" }) {
  const normalized = (role || "CLIENTE").toUpperCase();

  const configs = {
    CLIENTE: {
      label: "Cliente",
      icon: "shopping_bag",
      bg: "bg-[#ecfdf5]",
      border: "border-[#10b981]/30",
      text: "text-[#065f46]",
      tag: "bg-[#85f8c4] text-[#002114]",
    },
    CAJERO: {
      label: "Cajero POS",
      icon: "point_of_sale",
      bg: "bg-[#fffbeb]",
      border: "border-[#f59e0b]/30",
      text: "text-[#92400e]",
      tag: "bg-[#ffddb8] text-[#2a1700]",
    },
    ADMIN: {
      label: "Administrador",
      icon: "shield_person",
      bg: "bg-[#eef2ff]",
      border: "border-[#6366f1]/30",
      text: "text-[#3730a3]",
      tag: "bg-[#e1e0ff] text-[#07006c]",
    },
  };

  const config = configs[normalized] || configs.CLIENTE;

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-mono font-bold rounded-full border ${config.bg} ${config.border} ${config.text} ${sizeClasses}`}
    >
      <span className="material-symbols-outlined text-[15px]">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
