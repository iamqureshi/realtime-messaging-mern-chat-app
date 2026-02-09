import React from 'react';
import { Phone, Video, MoreVertical, ChevronLeft, Search } from 'lucide-react';

interface ChatHeaderProps {
  chatName: string;
  avatar?: string;
  isOnline: boolean;
  isTyping?: boolean;
  onBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, avatar, isOnline, isTyping, onBack }) => {
  return (
    <div className="w-full h-16 sm:h-20 px-4 py-2 border-b border-gray-800 bg-gray-900/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="relative group cursor-pointer">
           {avatar ? (
              <img 
               src={avatar} 
               alt={chatName} 
               className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all duration-300"
              />
           ) : (
             <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {chatName.charAt(0).toUpperCase()}
             </div>
           )}
         
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-900 rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col cursor-pointer">
          <h2 className="text-lg font-bold text-white leading-tight hover:underline decoration-emerald-500/50 underline-offset-4 decoration-2">
            {chatName}
          </h2>
          <span className={`text-xs ${isTyping ? 'text-emerald-400 font-bold animate-pulse' : (isOnline ? 'text-emerald-400 font-medium' : 'text-gray-500')}`}>
            {isTyping ? 'Typing...' : (isOnline ? 'Online' : 'Offline')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 text-gray-400">
        <button className="hidden sm:block p-2.5 hover:bg-gray-800 rounded-full transition hover:text-emerald-400" title="Search">
            <Search size={20} />
        </button>
        <button className="p-2.5 hover:bg-gray-800 rounded-full transition hover:text-emerald-400" title="Voice Call">
          <Phone size={20} />
        </button>
        <button className="p-2.5 hover:bg-gray-800 rounded-full transition hover:text-emerald-400" title="Video Call">
          <Video size={20} />
        </button>
        <button className="p-2.5 hover:bg-gray-800 rounded-full transition hover:text-white" title="Info">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};
