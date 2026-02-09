import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "./config/env";
import { Message } from "./models/message.model";

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
        if (!user) return;
        const userId = user._id ? String(user._id) : String(user);
        if (userId === String(senderId)) return;
 
        socket.in(userId).emit("message_recieved", newMessageRecieved);
      });
    });

    socket.on("read_message", async (data: { chatId: string, userId: string }) => {
        const { chatId, userId } = data;
        
        try {
            await Message.updateMany(
                { 
                    chatId: chatId, 
                    senderId: { $ne: userId },
                    seenBy: { $ne: userId }
                },
                {
                    $addToSet: { seenBy: userId }
                }
            );

            socket.in(chatId).emit("message_read", { chatId, userId });
        } catch (error) {
            console.error("Error marking messages as read via socket:", error);
        }
    });

    socket.on("message_delivered", async (data: { chatId: string, messageId: string, userId: string }) => {
        const { chatId, messageId, userId } = data;
        
        try {
            await Message.findByIdAndUpdate(
                messageId,
                {
                    $addToSet: { deliveredTo: userId },
                    $max: { status: "delivered" }
                }
            );
            
            const msg = await Message.findById(messageId);
            if (msg && msg.status === 'sent') {
                msg.status = 'delivered';
                await msg.save();
            }

            // Broadcast
            socket.in(chatId).emit("message_delivered", { chatId, messageId, userId });
        } catch (error) {
            console.error("Error marking message as delivered via socket:", error);
        }
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
