import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "./config/env";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: [env.CORS_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
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
      socket.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("join_chat", (room: string) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room: string) => socket.in(room).emit("typing", room));
    socket.on("stop_typing", (room: string) => socket.in(room).emit("stop_typing", room));

    socket.on("new_message", (newMessageRecieved: any) => {
      const chat = newMessageRecieved.chat || newMessageRecieved.chatId;

      if (!chat) return console.log("Chat not defined");
      if (!chat.members) return console.log("chat.members not defined");

      const senderId = newMessageRecieved.senderId?._id || newMessageRecieved.sender?._id || newMessageRecieved.senderId;

      chat.members.forEach((user: any) => {
        const userId = user._id ? String(user._id) : String(user);
        if (userId === String(senderId)) return;

        socket.in(userId).emit("message_recieved", newMessageRecieved);
      });
    });

    socket.on("read_message", (data: { chatId: string, userId: string }) => {
        // Broadcast to the chat room that messages have been read
        socket.in(data.chatId).emit("message_read", data);
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
