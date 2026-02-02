import React, { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Chat, Message } from '../../types';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages, onSendMessage, onBack }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0f1c] relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
      
      <ChatHeader participant={chat.participant} onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar z-10 w-full max-w-5xl mx-auto">
        {messages.map((msg) => {
          const isOwn = msg.senderId === 'me';
          // Check if previous message timestamp is close to current to group them visually (optional enhancement)
          return (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={isOwn} 
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full max-w-5xl mx-auto z-10">
         <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};
