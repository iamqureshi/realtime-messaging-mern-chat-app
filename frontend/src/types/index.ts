export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  fileUrl?: string; // If type is image or file
}

export interface Chat {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount?: number;
  isTyping?: boolean;
}
