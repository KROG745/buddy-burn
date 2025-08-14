import { Zap, Target, Calendar, MapPin, Trophy, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IceBreaker {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  category: string;
}

interface ChatIceBreakersProps {
  onSelect?: (message: string) => void;
  selectedMessage?: string;
}

const ChatIceBreakers = ({ onSelect, selectedMessage }: ChatIceBreakersProps) => {
  const iceBreakers: IceBreaker[] = [
    {
      id: "1",
      icon: <Target className="w-4 h-4" />,
      title: "Workout Buddy",
      message: "Hey! Want to be workout buddies? I'm looking for someone to stay motivated with! 💪",
      category: "Partnership"
    },
    {
      id: "2", 
      icon: <Zap className="w-4 h-4" />,
      title: "Favorite Exercise",
      message: "What's your favorite exercise and why? I'm always looking for new workout ideas! 🏋️‍♀️",
      category: "Discussion"
    },
    {
      id: "3",
      icon: <Calendar className="w-4 h-4" />,
      title: "Weekly Schedule",
      message: "What does your weekly workout schedule look like? Maybe we can sync up! 📅",
      category: "Planning"
    },
    {
      id: "4",
      icon: <MapPin className="w-4 h-4" />,
      title: "Local Gym",
      message: "Do you know any good gyms or fitness spots in the area? I'm looking for recommendations! 🏃‍♂️",
      category: "Local"
    },
    {
      id: "5",
      icon: <Trophy className="w-4 h-4" />,
      title: "Fitness Goals",
      message: "What are your current fitness goals? I'd love to hear about your journey! 🎯",
      category: "Goals"
    },
    {
      id: "6",
      icon: <Heart className="w-4 h-4" />,
      title: "Motivation",
      message: "What keeps you motivated to stay active? I could use some inspiration! ✨",
      category: "Inspiration"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Partnership": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Discussion": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Planning": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Local": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Goals": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Inspiration": return "bg-pink-500/10 text-pink-600 border-pink-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const handleIceBreakerClick = (iceBreaker: IceBreaker) => {
    if (onSelect) {
      onSelect(iceBreaker.message);
    } else {
      // When used in the tab view, we could navigate to a general chat selection
      console.log(`Selected ice breaker: ${iceBreaker.title} - ${iceBreaker.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Start a Conversation</h3>
        <span className="text-sm text-muted-foreground">Tap to use</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {iceBreakers.map((iceBreaker) => (
          <Card 
            key={iceBreaker.id}
            className={`p-4 transition-all duration-200 cursor-pointer border-border/50 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] ${
              selectedMessage === iceBreaker.message 
                ? "bg-primary/10 border-primary/30 shadow-md" 
                : "bg-card/50 hover:bg-accent/50"
            }`}
            onClick={() => handleIceBreakerClick(iceBreaker)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                    {iceBreaker.icon}
                  </div>
                  <h4 className="font-medium text-foreground text-sm">
                    {iceBreaker.title}
                  </h4>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${getCategoryColor(iceBreaker.category)}`}
                >
                  {iceBreaker.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {iceBreaker.message}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatIceBreakers;