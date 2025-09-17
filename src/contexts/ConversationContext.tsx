import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  lastActivity: Date;
}

interface ConversationContextType {
  conversations: Conversation[];
  addConversation: (conversation: Omit<Conversation, 'lastActivity'>) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  updateLastMessage: (id: string, message: string) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversations = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
};

interface ConversationProviderProps {
  children: ReactNode;
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Alex Runner",
      avatar: "/placeholder.svg",
      lastMessage: "Great workout today! Let's hit the gym tomorrow 💪",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: "2",
      name: "Fitness Squad",
      avatar: "/placeholder.svg",
      lastMessage: "Sarah: Who's joining for the morning run?",
      timestamp: "15 min ago",
      unreadCount: 5,
      isOnline: false,
      lastActivity: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: "3",
      name: "Maria Yoga",
      avatar: "/placeholder.svg",
      lastMessage: "The yoga session was amazing! 🧘‍♀️",
      timestamp: "1 hour ago",
      unreadCount: 0,
      isOnline: true,
      lastActivity: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "4",
      name: "Gym Buddies",
      avatar: "/placeholder.svg",
      lastMessage: "Mike: New deadlift PR! 🎉",
      timestamp: "2 hours ago",
      unreadCount: 1,
      isOnline: false,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "5",
      name: "Emma Strong",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for the workout tips!",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: false,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]);

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const addConversation = (newConversation: Omit<Conversation, 'lastActivity'>) => {
    const conversation: Conversation = {
      ...newConversation,
      lastActivity: new Date(),
    };
    
    setConversations(prev => {
      // Check if conversation already exists
      const exists = prev.find(c => c.id === conversation.id);
      if (exists) {
        // Update existing conversation
        return prev.map(c => 
          c.id === conversation.id 
            ? { ...c, ...conversation, timestamp: formatTimestamp(conversation.lastActivity) }
            : c
        ).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
      }
      
      // Add new conversation and sort by most recent
      return [conversation, ...prev].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    });
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { 
              ...conv, 
              ...updates, 
              lastActivity: updates.lastMessage ? new Date() : conv.lastActivity,
              timestamp: updates.lastMessage ? formatTimestamp(new Date()) : conv.timestamp
            }
          : conv
      ).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    );
  };

  const updateLastMessage = (id: string, message: string) => {
    const now = new Date();
    updateConversation(id, {
      lastMessage: message,
      timestamp: formatTimestamp(now),
      lastActivity: now,
    });
  };

  return (
    <ConversationContext.Provider value={{
      conversations: conversations.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()),
      addConversation,
      updateConversation,
      updateLastMessage,
    }}>
      {children}
    </ConversationContext.Provider>
  );
};