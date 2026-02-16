import React, { useEffect, useRef, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Chat, Message } from '../../types';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages, onSendMessage, onBack }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [typingUsers, setTypingUsers] = useState<{ userId: string, userName: string, lastActive: number }[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]); 

  useEffect(() => {
      const interval = setInterval(() => {
          setTypingUsers((prev) => {
              const next = prev.filter(u => Date.now() - u.lastActive < 4500);
              if (next.length !== prev.length) return next;
              return prev;
          });
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket || !chat) return;
    
    setTypingUsers([]);

    const handleTyping = (data: any) => {
      
        const chatId = typeof data === 'string' ? data : data.chatId;
        const userId = typeof data === 'string' ? '' : data.userId;
        const userName = typeof data === 'string' ? 'Someone' : data.userName;
        
        if (chat._id === chatId && userId !== user?._id) {
            setTypingUsers((prev) => {
            
                const others = prev.filter(u => u.userId !== userId);
                return [...others, { userId, userName, lastActive: Date.now() }];
            });
        }
    };

    const handleStopTyping = (data: any) => {
        const chatId = typeof data === 'string' ? data : data.chatId;
        const userId = typeof data === 'string' ? '' : data.userId;

        if (chat._id === chatId) {
             setTypingUsers((prev) => prev.filter(u => u.userId !== userId));
        }
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    if (chat && user) {
        socket.emit("read_message", { chatId: chat._id, userId: user._id });
    }

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, chat, user]);

  const handleTypingStart = () => {
    if (socket && chat && user) {
        socket.emit("typing", { chatId: chat._id, userId: user._id, userName: user.userName });
    }
  };

  const handleTypingStop = () => {
    if (socket && chat && user) {
        socket.emit("stop_typing", { chatId: chat._id, userId: user._id });
    }
  };


  const getDisplayInfo = () => {
      if (!chat || !user) return { name: '', avatar: '', isOnline: false, onlineCount: 0 };
      
      const members = chat.members || []; 

      if (chat.isGroup) {
          const onlineCount = members.filter(m => m && onlineUsers.includes(m._id)).length;
          return {
              name: chat.chatName,
              avatar: '', 
              isOnline: onlineCount > 0,
              onlineCount
          };
      }

      const other = members.find(m => m && m._id !== user._id) || members[0];
      return {
          name: other?.userName || 'Unknown',
          avatar: other?.avatar,
          isOnline: other ? onlineUsers.includes(other._id) : false,
          onlineCount: other && onlineUsers.includes(other._id) ? 1 : 0
      };
  };

  if (!chat) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gray-900 border-l border-gray-800 h-full text-center p-8">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <MessageSquare size={48} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-200 mb-3">Welcome to AMU Chat</h2>
        <p className="text-gray-400 max-w-sm text-lg">
          Select a conversation from the sidebar to start chatting or connect with new friends.
        </p>
        <div className="mt-8 flex gap-2">
            <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
            <span className="w-3 h-3 bg-gray-600 rounded-full"></span>
            <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
        </div>
      </div>
    );
  }

  const { name, avatar, isOnline, onlineCount } = getDisplayInfo();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0f1c] relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
      
      <ChatHeader 
        chatName={name} 
        avatar={avatar} 
        isOnline={isOnline} 
        onlineCount={onlineCount}
        typingUsers={typingUsers}
        onBack={onBack} 
      />
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar z-10 w-full max-w-5xl mx-auto">
        {messages.map((msg) => {
          const senderId = typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id;
          const isOwn = senderId === user?._id;
          
          return (
            <MessageBubble 
              key={msg._id || Math.random().toString()} // Fallback key
              message={msg} 
              isOwn={isOwn} 
            />
          );
        })}
        {typingUsers.length > 0 && (
             <div className="flex items-center gap-2 mb-2 ml-4">
                 <div className="bg-gray-800 rounded-full px-4 py-1 flex items-center gap-2">
                     <span className="text-xs text-gray-400">
                        {typingUsers.length === 1 
                            ? `${typingUsers[0].userName} is typing...`
                            : typingUsers.length === 2 
                                ? `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`
                                : `${typingUsers.length} people are typing...`
                        }
                     </span>
                     <span className="flex gap-1">
                         <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                         <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                         <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                     </span>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full max-w-5xl mx-auto z-10">
         <ChatInput 
            onSendMessage={onSendMessage} 
            onTyping={handleTypingStart}
            onStopTyping={handleTypingStop}
         />
      </div>
    </div>
  );
};
