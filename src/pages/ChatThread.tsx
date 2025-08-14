import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Smile, Paperclip, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "contact";
  timestamp: string;
  isIceBreaker?: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

const ChatThread = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock contact data - in real app, this would be fetched based on contactId
  const contact: Contact = {
    id: contactId || "1",
    name: "Alex Runner",
    avatar: "/placeholder.svg",
    isOnline: true,
  };

  // Get initial ice breaker message from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const iceBreaker = urlParams.get('iceBreaker');
    
    if (iceBreaker && messages.length === 0) {
      const initialMessage: Message = {
        id: "1",
        content: decodeURIComponent(iceBreaker),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isIceBreaker: true,
      };
      setMessages([initialMessage]);
      
      // Auto-reply from contact after a short delay
      setTimeout(() => {
        const reply: Message = {
          id: "2",
          content: "Hey! That sounds great! I'm always excited to connect with fellow fitness enthusiasts! 💪",
          sender: "contact",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
      
      // Mock auto-reply
      setTimeout(() => {
        const replies = [
          "That's awesome! 🔥",
          "I totally agree!",
          "Sounds like a plan! When should we start?",
          "Great idea! Let's do it! 💪",
          "I'm in! This will be fun! 🏃‍♀️",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          content: randomReply,
          sender: "contact",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, reply]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/chat")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">{contact.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {contact.isOnline ? "Active now" : "Last seen recently"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : ""}`}>
              {msg.isIceBreaker && (
                <div className="mb-2 flex justify-center">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs px-3 py-1">
                    🧊 Ice Breaker
                  </Badge>
                </div>
              )}
              
              <Card
                className={`p-3 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/70 backdrop-blur-sm"
                } ${msg.isIceBreaker ? "border-primary/30 bg-primary/5 text-foreground" : ""}`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === "user" 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  } ${msg.isIceBreaker ? "text-muted-foreground" : ""}`}
                >
                  {msg.timestamp}
                </p>
              </Card>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-card/50 backdrop-blur-sm border-t border-border/50 p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 bg-background/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;