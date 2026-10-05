import api from "./axios";

export const adminApi = {
  /**
   * Acceso al área administrativa
   * GET /api/auth/admin-only
   */
  async getAdminArea() {
    const response = await api.get("/auth/admin-only");
    return response.data;
  },
};

export default adminApi;
