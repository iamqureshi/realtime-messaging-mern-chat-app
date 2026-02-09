import api from "./api";
import { User } from "../types";

export const userService = {
  async searchUsers(search: string): Promise<User[]> {
    const response = await api.get(`/users?search=${search}`);
    return response.data.data;
  },

  async updateProfile(data: FormData): Promise<User> {
      const response = await api.put("/users/profile", data, {
          headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data.data;
  }
};
