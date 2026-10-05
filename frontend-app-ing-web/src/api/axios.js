import axios from "axios";

// Base URL configurada desde .env (http://localhost:3000/api por defecto)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Solicitud: Añade automáticamente el Token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("supermarket_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo unificado de estados HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const data = error.response ? error.response.data : null;

    if (status === 401) {
      // Token inválido o expirado
      console.warn("⚠️ Sesión expirada o credenciales inválidas (401)");
      // Si la URL no es /login, limpiar token y permitir redirección
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("supermarket_token");
        localStorage.removeItem("supermarket_user");
        window.dispatchEvent(new Event("auth:session-expired"));
      }
    } else if (status === 403) {
      console.warn("🚫 Acceso Denegado por permisos insuficientes (403)");
      window.dispatchEvent(new Event("auth:forbidden"));
    }

    // Retornar mensaje legible provisto por Spring Boot ApiResponse o error genérico
    const message =
      (data && data.message) ||
      (data && data.error) ||
      error.message ||
      "Error de conexión con el servidor";

    return Promise.reject({ status, message, raw: data });
  }
);

export default api;