import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary", // primary, secondary, outline, danger, amber, ghost
  size = "md", // sm, md, lg
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs gap-1.5",
    md: "h-11 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#006948] hover:bg-[#005137] text-white focus:ring-[#85f8c4] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#4648d4] hover:bg-[#3436b8] text-white focus:ring-[#c0c1ff] shadow-sm",
    amber:
      "bg-[#ffb95f] hover:bg-[#ffaa40] text-[#2a1700] font-semibold focus:ring-[#ffdcb8] shadow-sm",
    outline:
      "bg-white hover:bg-[#f2f3ff] text-[#131b2e] border border-[#bccac0] hover:border-[#6d7a72] focus:ring-[#68dba9]",
    danger:
      "bg-[#ba1a1a] hover:bg-[#93000a] text-white focus:ring-[#ffdad6] shadow-sm",
    ghost:
      "bg-transparent hover:bg-[#f2f3ff] text-[#3d4a42] hover:text-[#131b2e] focus:ring-[#68dba9]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {Icon && (
            <span className="material-symbols-outlined text-[18px]">
              {typeof Icon === "string" ? Icon : null}
            </span>
          )}
          {typeof Icon !== "string" && Icon ? <Icon size={18} /> : null}
          {children}
          {IconRight && (
            <span className="material-symbols-outlined text-[18px]">
              {typeof IconRight === "string" ? IconRight : null}
            </span>
          )}
          {typeof IconRight !== "string" && IconRight ? <IconRight size={18} /> : null}
        </>
      )}
    </button>
  );
}
