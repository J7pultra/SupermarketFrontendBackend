import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center justify-center p-4">
      <div className="text-center flex flex-col items-center gap-4 max-w-md">
        <span className="font-display font-bold text-7xl text-[#006948]">404</span>
        <h1 className="font-display font-bold text-2xl text-[#131b2e]">Página No Encontrada</h1>
        <p className="text-sm text-[#6d7a72]">
          El recurso o ruta solicitada en Supermarket OS no existe o fue reubicada.
        </p>
        <Button variant="primary" onClick={() => navigate("/profile")} icon="home" className="mt-2">
          Ir a Inicio
        </Button>
      </div>
    </div>
  );
}
