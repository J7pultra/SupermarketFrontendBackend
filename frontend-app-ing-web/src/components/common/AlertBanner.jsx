import React from "react";

export default function AlertBanner({
  type = "error", // error, success, warning, info
  title,
  message,
  onClose,
  className = "",
}) {
  if (!message) return null;

  const typeConfigs = {
    error: {
      bg: "bg-[#fff1f2]",
      border: "border-[#f43f5e]/40",
      text: "text-[#9f1239]",
      titleColor: "text-[#ba1a1a]",
      icon: "error",
    },
    success: {
      bg: "bg-[#ecfdf5]",
      border: "border-[#10b981]/40",
      text: "text-[#065f46]",
      titleColor: "text-[#006948]",
      icon: "check_circle",
    },
    warning: {
      bg: "bg-[#fffbeb]",
      border: "border-[#f59e0b]/40",
      text: "text-[#92400e]",
      titleColor: "text-[#825100]",
      icon: "warning",
    },
    info: {
      bg: "bg-[#f2f3ff]",
      border: "border-[#4648d4]/30",
      text: "text-[#283044]",
      titleColor: "text-[#4648d4]",
      icon: "info",
    },
  };

  const config = typeConfigs[type] || typeConfigs.error;

  return (
    <div
      className={`rounded-lg border p-3 flex items-start gap-2.5 shadow-sm animate-fade-in ${config.bg} ${config.border} ${config.text} ${className}`}
      role="alert"
    >
      <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <div className={`font-mono text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
            {title}
          </div>
        )}
        <p className="text-sm mt-0.5 leading-snug">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 p-0.5 transition-opacity"
          aria-label="Cerrar alerta"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}
