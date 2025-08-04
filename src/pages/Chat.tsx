import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationsList from "@/components/ConversationsList";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Messages</h1>
              <p className="text-sm text-muted-foreground">Stay connected with your fitness friends</p>
            </div>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Conversations List */}
        <ConversationsList />
      </div>
    </div>
  );
};

export default Chat;