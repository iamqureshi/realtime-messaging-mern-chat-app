import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTail?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showTail = true }) => {
  const content = message.content || message.text;
  const time = message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}>
      <div 
        className={`
          relative max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] px-4 py-2 shadow-sm
          ${showTail ? 'mb-1' : 'mb-0.5'}
          ${isOwn 
            ? `bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-tr-sm` 
            : 'bg-gray-800 text-gray-100 rounded-2xl rounded-tl-sm border border-gray-700/50'
          }
        `}
      >
        <p className="text-[15px] sm:text-[16px] leading-[1.4] whitespace-pre-wrap break-words">
          {content}
        </p>
        
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-emerald-200' : 'text-gray-400'}`}>
          <span className="text-[10px] sm:text-[11px] font-medium opacity-80">
            {time}
          </span>
          {isOwn && (
             <span>
                {message.status === 'read' ? (
                   <CheckCheck size={14} className="text-blue-300" />
                ) : message.status === 'delivered' ? (
                   <CheckCheck size={14} />
                ) : (
                   <Check size={14} />
                )}
             </span>
          )}
        </div>
      </div>
    </div>
  );
};
