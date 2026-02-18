import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Plus, Send, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import ConversationsList from "@/components/ConversationsList";
import ChatIceBreakers from "@/components/ChatIceBreakers";
import Navigation from "@/components/Navigation";
import { useConversations } from "@/contexts/ConversationContext";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const { addConversation } = useConversations();
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isFindFriendOpen, setIsFindFriendOpen] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedIceBreaker, setSelectedIceBreaker] = useState<string>("");

  const contacts: Contact[] = [
    { id: "1", name: "Alex Runner", avatar: "/placeholder.svg", isOnline: true },
    { id: "2", name: "Maria Yoga", avatar: "/placeholder.svg", isOnline: true },
    { id: "3", name: "Emma Strong", avatar: "/placeholder.svg", isOnline: false },
    { id: "4", name: "Mike Power", avatar: "/placeholder.svg", isOnline: true },
    { id: "5", name: "Sarah Flex", avatar: "/placeholder.svg", isOnline: false },
  ];

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleIceBreakerSelect = (message: string) => {
    setSelectedIceBreaker(message);
  };

  const handleStartChat = () => {
    if (selectedContacts.length > 0) {
      const contactId = selectedContacts[0]; // For now, just use the first selected contact
      const selectedContact = contacts.find(c => c.id === contactId);
      
      if (selectedContact) {
        // Add or update conversation
        addConversation({
          id: contactId,
          name: selectedContact.name,
          avatar: selectedContact.avatar,
          lastMessage: selectedIceBreaker || "Started a new conversation",
          timestamp: "Just now",
          unreadCount: 0,
          isOnline: selectedContact.isOnline,
        });
      }
      
      const queryParams = selectedIceBreaker 
        ? `?iceBreaker=${encodeURIComponent(selectedIceBreaker)}`
        : '';
      
      navigate(`/chat/${contactId}${queryParams}`);
      setIsNewChatOpen(false);
      setSelectedContacts([]);
      setSelectedIceBreaker("");
    }
  };

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
          <div className="flex items-center space-x-2">
          <Dialog open={isFindFriendOpen} onOpenChange={(open) => { setIsFindFriendOpen(open); if (!open) setFriendSearchQuery(""); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                <Users className="w-4 h-4 mr-2" />
                Find
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Find a Friend</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={friendSearchQuery}
                    onChange={(e) => setFriendSearchQuery(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No friends found</p>
                  ) : (
                    filteredContacts.map((contact) => (
                      <Card
                        key={contact.id}
                        className="p-3 cursor-pointer hover:bg-accent/50 transition-all duration-200"
                        onClick={() => {
                          addConversation({
                            id: contact.id,
                            name: contact.name,
                            avatar: contact.avatar,
                            lastMessage: "Started a new conversation",
                            timestamp: "Just now",
                            unreadCount: 0,
                            isOnline: contact.isOnline,
                          });
                          navigate(`/chat/${contact.id}`);
                          setIsFindFriendOpen(false);
                          setFriendSearchQuery("");
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {contact.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium">{contact.name}</span>
                            <p className="text-xs text-muted-foreground">{contact.isOnline ? "Online" : "Offline"}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>Start New Conversation</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Contact Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Friends</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {contacts.map((contact) => (
                      <Card
                        key={contact.id}
                        className={`p-3 cursor-pointer transition-all duration-200 ${
                          selectedContacts.includes(contact.id)
                            ? "bg-primary/10 border-primary/30"
                            : "hover:bg-accent/50"
                        }`}
                        onClick={() => handleContactSelect(contact.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {contact.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                            )}
                          </div>
                          <span className="text-sm font-medium">{contact.name}</span>
                          {selectedContacts.includes(contact.id) && (
                            <div className="ml-auto w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Ice Breaker Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Choose a Conversation Starter (Optional)</Label>
                  <div className="space-y-2">
                    <ChatIceBreakers onSelect={handleIceBreakerSelect} selectedMessage={selectedIceBreaker} />
                  </div>
                </div>

                {/* Selected Ice Breaker Preview */}
                {selectedIceBreaker && (
                  <div className="p-3 bg-accent/30 rounded-md">
                    <Label className="text-xs text-muted-foreground">Your message:</Label>
                    <p className="text-sm mt-1">{selectedIceBreaker}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsNewChatOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleStartChat}
                    disabled={selectedContacts.length === 0}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
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
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Chat;