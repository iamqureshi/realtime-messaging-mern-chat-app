import { Chat, Message, User } from '../types';

export const currentUser: User = {
  id: 'me',
  name: 'Samir Shaikh',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=faces',
  status: 'online',
  bio: 'Full Stack Developer',
};

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    status: 'online',
  },
  {
    id: 'u2',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    status: 'busy',
  },
  {
    id: 'u3',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    status: 'offline',
  },
  {
    id: 'u4',
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    status: 'online',
  },
];

export const mockChats: Chat[] = [
  {
    id: 'c1',
    participant: mockUsers[0],
    unreadCount: 2,
    lastMessage: {
      id: 'm100',
      senderId: 'u1',
      content: 'Hey! Are we still on for the meeting?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      status: 'delivered',
      type: 'text',
    },
  },
  {
    id: 'c2',
    participant: mockUsers[1],
    unreadCount: 0,
    isTyping: true,
    lastMessage: {
      id: 'm200',
      senderId: 'me',
      content: 'I sent you the design files.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      status: 'read',
      type: 'text',
    },
  },
  {
    id: 'c3',
    participant: mockUsers[2],
    unreadCount: 0,
    lastMessage: {
      id: 'm300',
      senderId: 'u3',
      content: 'Thanks for the help yesterday!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      status: 'read',
      type: 'text',
    },
  },
];

export const mockMessages: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      senderId: 'me',
      content: 'Hi Sarah, how are you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm2',
      senderId: 'u1',
      content: 'I am doing great! Just finishing up some work.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm3',
      senderId: 'u1',
      content: 'Hey! Are we still on for the meeting?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'delivered',
      type: 'text',
    },
  ],
  c2: [
    {
      id: 'm10',
      senderId: 'u2',
      content: 'Yo, did you see the new layout?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm11',
      senderId: 'me',
      content: 'Yes, it looks amazing! Great job.',
      timestamp: new Date(Date.now() - 1000 * 60 * 118).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm12',
      senderId: 'me',
      content: 'I sent you the design files.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'read',
      type: 'text',
    },
  ],
};
