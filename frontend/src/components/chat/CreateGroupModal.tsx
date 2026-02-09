import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { User } from '../../types';
import { userService } from '../../services/user.service';
import { chatService } from '../../services/chat.service';

interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreated: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.searchUsers(query);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      console.error("Failed to search users", error);
    }
  };

  const handleSelectUser = (user: User) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length < 2) return;

    try {
      await chatService.createGroupChat(
        groupName, 
        JSON.stringify(selectedUsers.map(u => u._id)) as any
      );
      onGroupCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Group Chat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-400 mb-2">Group Name</label>
            <input
              type="text"
              className="w-full bg-gray-950 text-white rounded-xl border border-gray-800 p-3.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none placeholder:text-gray-600"
              placeholder="e.g. Project Alpha"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <label className="block text-sm font-medium text-gray-400 mb-2">Add Members</label>
             <div className="relative flex-shrink-0">
                <input
                  type="text"
                  className="w-full bg-gray-950 text-white rounded-xl border border-gray-800 p-3.5 pl-10 mb-3 focus:border-emerald-500 outline-none placeholder:text-gray-600"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="absolute left-3.5 top-3.5 text-gray-500 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
             </div>
            
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 max-h-24 overflow-y-auto custom-scrollbar p-1 flex-shrink-0">
                    {selectedUsers.map(u => (
                        <div key={u._id} className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-emerald-500/20 group animate-in fade-in zoom-in duration-200">
                            <span>{u.userName}</span>
                            <button 
                                type="button" 
                                onClick={() => handleSelectUser(u)}
                                className="hover:bg-emerald-500/20 rounded-full p-0.5 transition"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar border border-gray-800 rounded-xl bg-gray-950/50 min-h-[150px]">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        Searching...
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-800/50">
                        {searchResults.map(user => {
                            const isSelected = selectedUsers.find(u => u._id === user._id);
                            return (
                                <div 
                                key={user._id} 
                                onClick={() => handleSelectUser(user)}
                                className={`p-3.5 flex items-center gap-3 cursor-pointer hover:bg-gray-900 transition active:scale-[0.99] ${isSelected ? 'bg-gray-900/80' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors ${isSelected ? 'bg-emerald-600' : 'bg-gray-800'}`}>
                                        {isSelected ? <Check size={18} /> : user.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-emerald-400' : 'text-gray-200'}`}>{user.userName}</p>
                                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : search ? (
                    <div className="p-8 text-center text-gray-500">No users found</div>
                ) : (
                    <div className="p-8 text-center text-gray-600 text-sm">
                        Start typing to search for people to add
                    </div>
                )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 flex-shrink-0">
             <button
               type="button"
               onClick={onClose}
               className="px-5 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={!groupName || selectedUsers.length < 2}
               className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 active:scale-95 hover:shadow-emerald-600/30"
             >
               Create Group ({selectedUsers.length})
             </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
