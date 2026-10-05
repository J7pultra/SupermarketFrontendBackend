import React, { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("supermarket_token") || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("supermarket_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Escuchar eventos globales de axios interceptor
  useEffect(() => {
    const handleExpired = () => {
      logout();
    };

    window.addEventListener("auth:session-expired", handleExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleExpired);
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      // response: { status: "success", data: { token, user: { id, email, name, role } } }
      const authToken = response.data.token;
      const authUser = response.data.user;

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem("supermarket_token", authToken);
      localStorage.setItem("supermarket_user", JSON.stringify(authUser));

      return { success: true, user: authUser };
    } catch (error) {
      return { success: false, error: error.message || "Error al iniciar sesión" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(formData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message || "Error al registrar cuenta" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("supermarket_token");
    localStorage.removeItem("supermarket_user");
  };

  const role = user?.role ? user.role.toUpperCase() : null;
  const isAuthenticated = Boolean(token && user);
  const isAdmin = role === "ADMIN";
  const isCashier = role === "CAJERO";
  const isClient = role === "CLIENTE";

  const value = {
    token,
    user,
    role,
    isAuthenticated,
    isAdmin,
    isCashier,
    isClient,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
