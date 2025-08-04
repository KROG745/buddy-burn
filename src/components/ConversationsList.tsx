import { MessageCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ConversationsListProps {
  showSearch?: boolean;
  maxItems?: number;
}

const ConversationsList = ({ showSearch = true, maxItems }: ConversationsListProps) => {
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Alex Runner",
      avatar: "/placeholder.svg",
      lastMessage: "Great workout today! Let's hit the gym tomorrow 💪",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Fitness Squad",
      avatar: "/placeholder.svg",
      lastMessage: "Sarah: Who's joining for the morning run?",
      timestamp: "15 min ago",
      unreadCount: 5,
      isOnline: false,
    },
    {
      id: "3",
      name: "Maria Yoga",
      avatar: "/placeholder.svg",
      lastMessage: "The yoga session was amazing! 🧘‍♀️",
      timestamp: "1 hour ago",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "4",
      name: "Gym Buddies",
      avatar: "/placeholder.svg",
      lastMessage: "Mike: New deadlift PR! 🎉",
      timestamp: "2 hours ago",
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: "5",
      name: "Emma Strong",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for the workout tips!",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: false,
    },
  ];

  const displayedConversations = maxItems 
    ? conversations.slice(0, maxItems) 
    : conversations;

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
      )}
      
      <div className="space-y-2">
        {displayedConversations.map((conversation) => (
          <Card 
            key={conversation.id} 
            className="p-4 hover:bg-accent/50 transition-all duration-200 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {conversation.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-foreground truncate">
                    {conversation.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="bg-primary text-primary-foreground px-2 py-0.5 text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {maxItems && conversations.length > maxItems && (
        <div className="text-center">
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            View all conversations
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationsList;