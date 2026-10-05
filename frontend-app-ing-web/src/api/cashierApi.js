import api from "./axios";

export const cashierApi = {
  /**
   * Acceso al área de facturación y cajeros
   * GET /api/auth/cashier-area
   */
  async getCashierArea() {
    const response = await api.get("/auth/cashier-area");
    return response.data;
  },
};

export default cashierApi;
