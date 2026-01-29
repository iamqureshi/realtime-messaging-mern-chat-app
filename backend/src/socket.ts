import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "./config/env";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  
  const onlineUsers = new Map<string, string>();

  io.on("connection", (socket: Socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userId: string) => {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      socket.emit("connected");
      io.emit("user_online", userId);
    });

    socket.on("join_chat", (room: string) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room: string) => socket.in(room).emit("typing"));
    socket.on("stop_typing", (room: string) => socket.in(room).emit("stop_typing"));

    socket.on("new_message", (newMessageRecieved: any) => {
      const chat = newMessageRecieved.chat || newMessageRecieved.chatId;

      if (!chat.members) return console.log("chat.members not defined");

      chat.members.forEach((user: any) => {
        if (user._id === newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message_recieved", newMessageRecieved);
      });
    });

    socket.on("disconnect", () => {
      let disconnectedUserId: string | undefined;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit("user_offline", disconnectedUserId);
      }
    });
  });
};
