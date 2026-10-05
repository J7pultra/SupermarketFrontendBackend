import api from "./axios";

export const authApi = {
  /**
   * Registro de nuevo usuario (Cliente, Cajero o Admin)
   * POST /api/auth/register
   */
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data; // ApiResponse<UserResponseDto>
  },

  /**
   * Inicio de sesión
   * POST /api/auth/login
   */
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data; // ApiResponse<AuthResponse>
  },

  /**
   * Perfil del usuario autenticado
   * GET /api/auth/profile
   */
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data; // { message, user: { userId, role } }
  },
};

export default authApi;
