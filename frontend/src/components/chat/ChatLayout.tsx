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

      if (activeChatId && chatId === activeChatId) {
        setMessages((prev) => [...prev, newMessage]);
        // Emit read event if we are in this chat
        socket?.emit("read_message", { chatId, userId: "me" }); 
      }

      setChats((prev) => {
        const chatExists = prev.find(c => c._id === chatId);
        
        if (chatExists) {
             return prev.map((c) => {
              if (c._id === chatId) {
                return { ...c, latestMessage: newMessage };
              }
              return c;
            });
        } else {
      
            const chatData = newMessage.chatId;
            if (chatData && chatData._id && chatData.members) {
                
                 return [{ ...chatData, latestMessage: newMessage }, ...prev];
            }
            return prev;
        }
      });
    };

    const handleMessageRead = (data: { chatId: string }) => {
        if (activeChatId && data.chatId === activeChatId) {
            setMessages((prev) => 
                prev.map(msg => ({ ...msg, status: 'read' }))
            );
        }
    };

    socket.on("message_recieved", handleMessageReceived);
    socket.on("message_read", handleMessageRead);

    return () => {
      socket.off("message_recieved", handleMessageReceived);
      socket.off("message_read", handleMessageRead);
    };
  }, [socket, activeChatId]);

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
            ? { ...c, latestMessage: newMessage }
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

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <div className={`
        ${activeChatId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-auto h-full
      `}>
        <Sidebar 
          chats={chats} 
          activeChatId={activeChatId} 
          onSelectChat={setActiveChatId} 
          onAccessChat={handleAccessChat}
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
