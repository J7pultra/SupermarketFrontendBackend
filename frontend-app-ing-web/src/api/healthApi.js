import axios from "axios";

const serverOrigin = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:3000";

export const healthApi = {
  /**
   * Comprobación de salud del backend
   * GET /health
   */
  async checkHealth() {
    const response = await axios.get(`${serverOrigin}/health`, { timeout: 4000 });
    return response.data; // { status: "OK", message: "..." }
  },
};

export default healthApi;
