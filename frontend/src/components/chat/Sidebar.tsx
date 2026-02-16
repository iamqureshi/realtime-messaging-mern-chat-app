import React from 'react';
import { Search, Plus, MoreVertical, LogOut } from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';
import { Chat, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

import { ProfileModal } from './ProfileModal';

import { userService } from '../../services/user.service';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onAccessChat: (userId: string) => void;
  onRefresh: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onSelectChat, onAccessChat, onRefresh }) => {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = async () => {
      try {
          await logout();
      } catch (error) {
          console.error("Logout failed", error);
      }
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.searchUsers(query);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log("Error searching users", error);
      setLoading(false);
    }
  };

  const getSender = (loggedUser: User | null, members: User[]): User | undefined => {
      if (!loggedUser || !members || members.length < 2) return members[0]; // Fallback
      return members.find(m => m._id !== loggedUser._id);
  };

  const isUserOnline = (userId: string) => {
      return onlineUsers.includes(userId);
  };

  if (!user) return null;

  return (
    <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900 h-full">

      <div className="p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 bg-gray-900 z-10 backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={() => setShowProfileModal(true)}>
          {user.avatar ? (
               <img 
               src={user.avatar} 
               alt="My Profile" 
               className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
             />
          ) : (
             <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold border-2 border-emerald-500">
                 {user.userName?.charAt(0).toUpperCase()}
             </div>
          )}
         
          <h2 className="text-xl font-bold text-white tracking-tight">Chats</h2>
        </div>
        
        {showProfileModal && (
          <ProfileModal onClose={() => setShowProfileModal(false)} />
        )}

        <div className="flex gap-2 text-gray-400 relative">
           <button 
            onClick={() => setShowGroupModal(true)} 
            className="p-2 hover:bg-gray-800 rounded-full transition hover:text-white" 
            title="New Group"
          >
            <Plus size={20} />
          </button>
          
          {showGroupModal && (
            <CreateGroupModal 
              onClose={() => setShowGroupModal(false)} 
              onGroupCreated={() => {
                onRefresh();
                setShowGroupModal(false);
              }} 
            />
          )}
          <button 
            className="p-2 hover:bg-gray-800 rounded-full transition hover:text-white" 
            title="More"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <MoreVertical size={20} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <button 
                 onClick={handleLogout}
                 className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 hover:text-red-400 transition flex items-center gap-2 font-medium"
               >
                 <LogOut size={18} />
                 Logout
               </button>
            </div>
          )}

          {showDropdown && (
             <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
          )}
        </div>
      </div>

      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search or start new chat"
            className="w-full bg-gray-800 text-gray-200 pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder-gray-500"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {search ? (
           // Search Results
           loading ? (
             <div className="text-center text-gray-500 mt-10">Searching...</div>
           ) : (
             searchResult?.map((user) => (
               <div 
                 key={user._id}
                 onClick={() => {
                   onAccessChat(user._id);
                   setSearch("");
                   setSearchResult([]);
                 }}
                 className="w-full p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 border-b border-gray-800/50 hover:bg-gray-800/50"
               >
                 {user.avatar ? (
                    <img 
                    src={user.avatar} 
                    alt={user.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                 ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                        {user.userName.charAt(0).toUpperCase()}
                    </div>
                 )}
                 <div>
                   <h3 className="text-white font-semibold">{user.userName}</h3>
                   <p className="text-gray-400 text-sm">
                     {user.email}
                   </p>
                 </div>
               </div>
             ))
           )
        ) : (
          // Existing Chats
          chats.map((chat) => {
            const sender = chat.isGroup ? null : getSender(user, chat.members);
            const chatName = chat.isGroup ? chat.chatName : sender?.userName;
            const chatAvatar = chat.isGroup ? '' : sender?.avatar; 
            const isOnline = sender ? isUserOnline(sender._id) : false;
            
            return (
            <div 
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className={`w-full p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 border-b border-gray-800/50 hover:bg-gray-800/50 ${
                activeChatId === chat._id ? 'bg-gray-800 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="relative">
                  {chatAvatar ? (
                      <img 
                      src={chatAvatar} 
                      alt={chatName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                          {chatName?.charAt(0).toUpperCase()}
                      </div>
                  )}
                
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-gray-900 rounded-full"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-semibold truncate ${activeChatId === chat._id ? 'text-white' : 'text-gray-200'}`}>
                    {chatName}
                  </h3>
                  {chat.latestMessage && (
                     <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate pr-2 ${chat.unreadCount ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                     {chat.latestMessage ? (
                         chat.latestMessage.content || chat.latestMessage.text
                     ) : (
                         <span className="italic text-gray-600">No messages</span>
                     )}
                  </p>
                  {(chat.unreadCount || 0) > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-emerald-500 text-black text-xs font-bold rounded-full">
                          {chat.unreadCount}
                      </span>
                  )}
                </div>
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
};
