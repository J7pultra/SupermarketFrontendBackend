import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import CashierPOSPage from "../pages/CashierPOSPage";
import AdminConsolePage from "../pages/AdminConsolePage";
import ForbiddenPage from "../pages/ForbiddenPage";
import NotFoundPage from "../pages/NotFoundPage";

function HomeRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  if (role === "CAJERO") {
    return <Navigate to="/cashier" replace />;
  }
  return <Navigate to="/profile" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz con redirección inteligente */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Rutas Públicas de Acceso */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Protegidas por Rol (RBAC) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={["CAJERO", "ADMIN"]}>
              <CashierPOSPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminConsolePage />
            </ProtectedRoute>
          }
        />

        {/* Páginas de Error y Seguridad */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/403" element={<Navigate to="/forbidden" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
