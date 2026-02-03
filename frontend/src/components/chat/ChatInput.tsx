import React, { useState } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-gray-800/50 p-2 mb-8 rounded-2xl border border-gray-700/50 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all duration-300"
      >
        <button 
          type="button" 
          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-700/50 rounded-full transition-colors flex-shrink-0"
        >
          <Smile size={24} />
        </button>
        <button 
          type="button" 
          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-700/50 rounded-full transition-colors flex-shrink-0"
        >
          <Paperclip size={24} />
        </button>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type a message..."
          className="w-full bg-transparent text-white placeholder-gray-500 px-2 py-3 focus:outline-none resize-none max-h-32 custom-scrollbar text-[15px] leading-relaxed"
          rows={1}
          style={{ minHeight: '44px' }}
        />

        {text.trim() ? (
          <button 
            type="submit" 
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0 mb-0.5"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        ) : (
           <button 
            type="button" 
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5"
          >
            <Mic size={22} />
          </button>
        )}
      </form>
    </>
  );
};
