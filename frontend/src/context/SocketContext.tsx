import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ENDPOINT = "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  isSocketConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); 

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketIo = io(ENDPOINT, {
        reconnection: true,
      });

      setSocket(socketIo);

      socketIo.on("connect", () => {
        setIsSocketConnected(true);
        // User setup
        socketIo.emit("setup", user._id);
      });

      socketIo.on("disconnect", () => {
          setIsSocketConnected(false);
      });
      
      socketIo.on("online_users", (users: string[]) => {
        setOnlineUsers(users);
      });
      
      socketIo.on("user_online", (userId: string) => {
         setOnlineUsers((prev) => {
             if (prev.includes(userId)) return prev;
             return [...prev, userId];
         });
      });
      
      socketIo.on("user_offline", (userId: string) => {
          setOnlineUsers((prev) => prev.filter(id => id !== userId));
      });

      return () => {
        socketIo.disconnect();
        setIsSocketConnected(false);
        setSocket(null);
      };
    } else {
        // cleanup if user logs out
        if(socket) {
            socket.disconnect();
            setSocket(null);
            setIsSocketConnected(false);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isSocketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
