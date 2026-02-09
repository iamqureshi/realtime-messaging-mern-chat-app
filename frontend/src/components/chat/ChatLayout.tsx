import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { Chat, Message } from '../../types';
import { chatService } from '../../services/chat.service';
import { useSocket } from '../../context/SocketContext';

export const ChatLayout: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<{ id: string, text: string }[]>([]);
  const { socket } = useSocket();

  const activeChat = activeChatId ? chats.find(c => c._id === activeChatId) || null : null;

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const data = await chatService.fetchChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };

  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      try {
        const data = await chatService.fetchMessages(activeChatId);
        // Map backend message to include status for UI
        const messagesWithStatus = data.map((msg: any) => ({
            ...msg,
            status: msg.seenBy && msg.seenBy.length > 0 ? 'read' : 'sent'
        }));
        setMessages(messagesWithStatus);
        socket?.emit("join_chat", activeChatId);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    loadMessages();
  }, [activeChatId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessage: any) => {
     
      const chatId = newMessage.chatId?._id || newMessage.chatId;

      // Automatically emit delivered event since we received it
      socket?.emit("message_delivered", { 
          chatId, 
          messageId: newMessage._id, 
          userId: "me" 
      });

      // Play sound and show notification if message is not from me
      try {
          const senderId = newMessage.senderId?._id || newMessage.senderId;
          // Ideally check if senderId !== myId. But simplified:
          // Audio
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"); 
          audio.volume = 0.5;
          audio.play().catch(e => {});

          // In-app Notification
          if (!activeChatId || activeChatId !== chatId) {
              const senderName = newMessage.senderId?.userName || "Someone";
              const text = `New message from ${senderName}`;
              const id = Date.now().toString();
              setNotifications(prev => [...prev, { id, text }]);
              setTimeout(() => {
                  setNotifications(prev => prev.filter(n => n.id !== id));
              }, 4000);
          }
      } catch (error) {
          console.error("Sound/Notification error", error);
      }

      if (activeChatId && chatId === activeChatId) {
        // Map new message status to 'read' since we are here
        const msg = { ...newMessage, status: 'read' };
        setMessages((prev) => [...prev, msg]);
        // Emit read event if we are in this chat
        socket?.emit("read_message", { chatId, userId: "me" }); 
      } else {
          // If not in chat, we just confirmed delivery above.
          // Wait for backend to confirm delivery? No, we just received it.
      }

      setChats((prev) => {
        const chatExists = prev.find(c => c._id === chatId);
        
        if (chatExists) {
             return prev.map((c) => {
              if (c._id === chatId) {
                // If chat is open, unreadCount is 0, else increment or init to 1
                const isChatOpen = activeChatId === chatId;
                const newUnreadCount = isChatOpen ? 0 : (c.unreadCount || 0) + 1;
                
                return { 
                    ...c, 
                    latestMessage: newMessage,
                    unreadCount: newUnreadCount
                };
              }
              return c;
            });
        } else {
            // Chat not in list, add it
            const chatData = newMessage.chatId;
            if (chatData && chatData._id && chatData.members) {
                 return [{ ...chatData, latestMessage: newMessage, unreadCount: 1 }, ...prev];
            }
            return prev;
        }
      });
    };

    const handleMessageRead = (data: { chatId: string, userId: string }) => {
        if (activeChatId && data.chatId === activeChatId) {
            setMessages((prev) => 
                prev.map(msg => ({ ...msg, status: 'read' }))
            );
        }
    };

    const handleMessageDelivered = (data: { messageId: string, chatId: string }) => {
        if (activeChatId && data.chatId === activeChatId) {
             setMessages((prev) => 
                prev.map(msg => {
                    if (msg._id === data.messageId && msg.status !== 'read') {
                        return { ...msg, status: 'delivered' };
                    }
                    return msg;
                })
             );
        }
    };

    socket.on("message_recieved", handleMessageReceived);
    socket.on("message_read", handleMessageRead);
    socket.on("message_delivered", handleMessageDelivered);

    return () => {
      socket.off("message_recieved", handleMessageReceived);
      socket.off("message_read", handleMessageRead);
      socket.off("message_delivered", handleMessageDelivered);
    };
  }, [socket, activeChatId]);

  // Clear unread count when opening a chat
  useEffect(() => {
      if(activeChatId) {
          setChats(prev => prev.map(c => {
              if(c._id === activeChatId) {
                  return { ...c, unreadCount: 0 };
              }
              return c;
          }));
      }
  }, [activeChatId]);

  const handleSendMessage = async (text: string) => {
    if (!activeChatId) return;

    try {
      const newMessage = await chatService.sendMessage(text, activeChatId);
      const messageWithStatus = { ...newMessage, status: 'sent' };
      setMessages((prev) => [...prev, messageWithStatus]);
      socket?.emit("new_message", messageWithStatus);

      setChats((prev) =>
        prev.map((c) =>
          c._id === activeChatId
            ? { ...c, latestMessage: newMessage } // Don't touch unread count for own message
            : c
        )
      );
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleAccessChat = async (userId: string) => {
    try {
      const chat = await chatService.accessChat(userId);
      if (!chats.find((c) => c._id === chat._id)) {
        setChats((prev) => [chat, ...prev]);
      }
      setActiveChatId(chat._id);
    } catch (error) {
      console.error("Failed to access chat", error);
    }
  };



  // ... (render)
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      {/* Notifications Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {notifications.map(n => (
              <div key={n.id} className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right-full fade-in duration-300 max-w-sm pointer-events-auto flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <p className="font-medium text-sm">{n.text}</p>
              </div>
          ))}
      </div>

      <div className={`
        ${activeChatId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-auto h-full
      `}>
        <Sidebar 
          chats={chats} 
          activeChatId={activeChatId} 
          onSelectChat={setActiveChatId} 
          onAccessChat={handleAccessChat}
          onRefresh={fetchChats}
        />
      </div>

      <div className={`
        ${!activeChatId ? 'hidden md:flex' : 'flex'} 
        flex-1 h-full
      `}>
        <ChatWindow 
          chat={activeChat} 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onBack={() => setActiveChatId(null)}
        />
      </div>
    </div>
  );
};
