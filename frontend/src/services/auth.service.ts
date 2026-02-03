import api from "./api";

export const authService = {
  async register(userData: any) {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  async login(credentials: any) {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post("/users/logout");
    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/users/refresh-token");
    return response.data;
  },
};
