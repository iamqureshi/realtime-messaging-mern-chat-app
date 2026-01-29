import api from "./api";

export const authService = {
  async register(userData: any) {
    const response = await api.post("/register", userData);
    return response.data;
  },

  async login(credentials: any) {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/refresh-token");
    return response.data;
  },
};
