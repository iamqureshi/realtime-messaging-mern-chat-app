import api from "./api";

export const chatService = {
  async fetchChats() {
    const response = await api.get("/chats");
    return response.data;
  },

  async fetchMessages(chatId: string) {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  },

  async sendMessage(content: string, chatId: string) {
    const response = await api.post("/messages", {
       chatId,
       content,
    });
    return response.data;
  },

  async createGroupChat(name: string, users: string[]) {
      const response = await api.post("/chats/group", {
          name,
          users,
      });
      return response.data;
  },

  async accessChat(userId: string) {
      const response = await api.post("/chats", { userId });
      return response.data;
  }
};
