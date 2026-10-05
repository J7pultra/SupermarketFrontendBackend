import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

/**
 * Componente Guard que verifica autenticación y roles autorizados (RBAC)
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir a login guardando la ruta de origen
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles permitidos, verificar que el rol del usuario esté incluido
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(role);
    if (!hasRole) {
      // Redirigir a vista 403 Forbidden
      return <Navigate to="/forbidden" state={{ requiredRoles: allowedRoles, currentRole: role }} replace />;
    }
  }

  return children;
}
