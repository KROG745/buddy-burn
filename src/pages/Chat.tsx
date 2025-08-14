import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationsList from "@/components/ConversationsList";
import ChatIceBreakers from "@/components/ChatIceBreakers";

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

        {/* Chat Tabs */}
        <Tabs defaultValue="conversations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversations">Messages</TabsTrigger>
            <TabsTrigger value="icebreakers">Ice Breakers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="mt-6">
            <ConversationsList />
          </TabsContent>
          
          <TabsContent value="icebreakers" className="mt-6">
            <ChatIceBreakers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;