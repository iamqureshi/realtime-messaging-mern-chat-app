import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { mockChats, mockMessages } from '../../data/mockData';
import { Message } from '../../types';

export const ChatLayout: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState(mockChats);
  const [messages, setMessages] = useState(mockMessages);

  const activeChat = activeChatId ? chats.find(c => c.id === activeChatId) || null : null;
  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];

  const handleSendMessage = (text: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    };

    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    
   
    setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));
    
   
    setTimeout(() => {
        const reply: Message = {
            id: (Date.now() + 1).toString(),
            senderId: activeChat?.participant.id || 'unknown',
            content: 'This is an automatic reply mock.',
            timestamp: new Date().toISOString(),
            status: 'delivered',
            type: 'text',
        };
        
        setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), reply]
          }));

        setChats(prev => prev.map(chat => 
            chat.id === activeChatId 
            ? { ...chat, lastMessage: reply }
            : chat
        ));
    }, 2000);
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
        />
      </div>

      <div className={`
        ${!activeChatId ? 'hidden md:flex' : 'flex'} 
        flex-1 h-full
      `}>
        <ChatWindow 
          chat={activeChat} 
          messages={currentMessages} 
          onSendMessage={handleSendMessage}
          onBack={() => setActiveChatId(null)}
        />
      </div>
    </div>
  );
};
