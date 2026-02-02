import React from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';
import { Chat } from '../../types';
import { currentUser } from '../../data/mockData';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onSelectChat }) => {
  return (
    <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900 h-full">

      <div className="p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 bg-gray-900 z-10 backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt="My Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 hover:opacity-80 transition cursor-pointer"
          />
          <h2 className="text-xl font-bold text-white tracking-tight">Chats</h2>
        </div>
        <div className="flex gap-2 text-gray-400">
           <button className="p-2 hover:bg-gray-800 rounded-full transition hover:text-white" title="New Chat">
            <Plus size={20} />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full transition hover:text-white" title="More">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search or start new chat"
            className="w-full bg-gray-800 text-gray-200 pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {chats.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 border-b border-gray-800/50 hover:bg-gray-800/50 ${
              activeChatId === chat.id ? 'bg-gray-800 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="relative">
              <img 
                src={chat.participant.avatar} 
                alt={chat.participant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {chat.participant.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-gray-900 rounded-full"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`font-semibold truncate ${activeChatId === chat.id ? 'text-white' : 'text-gray-200'}`}>
                  {chat.participant.name}
                </h3>
                {chat.lastMessage && (
                   <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-2 ${chat.unreadCount ? 'text-gray-100 font-medium' : 'text-gray-400'}`}>
                  {chat.isTyping ? (
                    <span className="text-emerald-400 animate-pulse">Typing...</span>
                  ) : (
                    chat.lastMessage?.content || <span className="italic text-gray-600">No messages</span>
                  )}
                </p>
                {chat.unreadCount ? (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg shadow-emerald-500/20">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
