import React, { useEffect, useRef, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Chat, Message, User } from '../../types';
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
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); 
  useEffect(() => {
    if (!socket || !chat) return;
    
  
    setIsTyping(false);

    const handleTyping = (room: string) => {
      if (chat._id === room) setIsTyping(true);
    };
    const handleStopTyping = (room: string) => {
      if (chat._id === room) setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, chat]);

  const handleTypingStart = () => {
    if (socket && chat) socket.emit("typing", chat._id);
  };

  const handleTypingStop = () => {
    if (socket && chat) socket.emit("stop_typing", chat._id);
  };


  const getDisplayInfo = () => {
      if (!chat || !user) return { name: '', avatar: '', isOnline: false };
      
      if (chat.isGroup) {
          return {
              name: chat.chatName,
              avatar: '', 
              isOnline: false 
          };
      }

      
      const other = chat.members.find(m => m._id !== user._id) || chat.members[0];
      return {
          name: other?.userName || 'Unknown',
          avatar: other?.avatar,
          isOnline: other ? onlineUsers.includes(other._id) : false
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

  const { name, avatar, isOnline } = getDisplayInfo();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0f1c] relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
      
      <ChatHeader 
        chatName={name} 
        avatar={avatar} 
        isOnline={isOnline} 
        isTyping={isTyping}
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
        {isTyping && (
             <div className="flex items-center gap-2 mb-2 ml-4">
                 <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                     <span className="flex gap-1">
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
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
