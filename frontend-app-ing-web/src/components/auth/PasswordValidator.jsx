import React from "react";

export default function PasswordValidator({ password = "" }) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const rules = [
    { label: "Mínimo 8 caracteres (@Size min=8)", ok: hasMinLength },
    { label: "Al menos 1 letra mayúscula (A-Z)", ok: hasUppercase },
    { label: "Al menos 1 dígito numérico (0-9)", ok: hasNumber },
  ];

  return (
    <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex flex-col gap-1.5 text-xs font-mono transition-all">
      {rules.map((rule, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 transition-colors ${
            rule.ok ? "text-[#006948] font-semibold" : "text-[#6d7a72]"
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {rule.ok ? "check_circle" : "radio_button_unchecked"}
          </span>
          <span>{rule.label}</span>
        </div>
      ))}
    </div>
  );
}
