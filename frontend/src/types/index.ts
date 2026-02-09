export interface User {
  _id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'busy';
  bio?: string;
}

export interface Message {
  _id: string;
  senderId: User | string;
  content?: string;
  text?: string;
  chatId: string;
  createdAt: string;
  seenBy?: string[];
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  members: User[];
  latestMessage?: Message;
  groupAdmin?: string;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number; 
}
