import { useState } from "react";
import { Users, MapPin, Dumbbell, UserPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/contexts/ConversationContext";

interface MatchedUser {
  id: string;
  name: string;
  avatar: string;
  workoutType: string;
  location: string;
  time: string;
  distance: string;
  fitnessLevel: string;
  isOnline: boolean;
}

interface FindWorkoutMatchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutLocation?: string;
  workoutType: string;
  workoutDate: string;
  workoutTime: string;
}

const FindWorkoutMatch = ({
  open,
  onOpenChange,
  workoutLocation,
  workoutType,
  workoutDate,
  workoutTime,
}: FindWorkoutMatchProps) => {
  const navigate = useNavigate();
  const { addConversation } = useConversations();

  // Mock matched users based on location/type similarity
  const matchedUsers: MatchedUser[] = [
    {
      id: "match-1",
      name: "Jordan Lee",
      avatar: "/placeholder.svg",
      workoutType: workoutType,
      location: workoutLocation || "Nearby Gym",
      time: workoutTime,
      distance: "0.3 mi",
      fitnessLevel: "Intermediate",
      isOnline: true,
    },
    {
      id: "match-2",
      name: "Taylor Swift",
      avatar: "/placeholder.svg",
      workoutType: workoutType,
      location: "FitLife Center",
      time: "18:30",
      distance: "1.2 mi",
      fitnessLevel: "Advanced",
      isOnline: true,
    },
    {
      id: "match-3",
      name: "Casey Morgan",
      avatar: "/placeholder.svg",
      workoutType: workoutType,
      location: "Iron Works Gym",
      time: "17:00",
      distance: "2.8 mi",
      fitnessLevel: "Beginner",
      isOnline: false,
    },
    {
      id: "match-4",
      name: "Riley Chen",
      avatar: "/placeholder.svg",
      workoutType: "strength",
      location: workoutLocation || "Nearby Gym",
      time: "19:00",
      distance: "4.5 mi",
      fitnessLevel: "Intermediate",
      isOnline: false,
    },
  ];

  const handleAddFriend = (user: MatchedUser) => {
    toast.success(`Friend request sent to ${user.name}!`);
  };

  const handleChat = (user: MatchedUser) => {
    addConversation({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      lastMessage: "Started a new conversation",
      timestamp: "Just now",
      unreadCount: 0,
      isOnline: user.isOnline,
    });
    onOpenChange(false);
    navigate(`/chat/${user.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Find Workout Buddies</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Context info */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 space-y-1">
            <p className="text-xs text-muted-foreground">Showing people with similar workouts near:</p>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{workoutLocation || "Your location"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Dumbbell className="w-3 h-3" />
              <span className="capitalize">{workoutType}</span>
              <span>•</span>
              <span>{workoutDate} at {workoutTime}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {matchedUsers.length} public profiles within 5 miles
          </p>

          {/* Matched users */}
          <div className="space-y-2">
            {matchedUsers.map((user) => (
              <Card key={user.id} className="p-3 transition-all duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-background" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.fitnessLevel}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {user.distance}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="w-3 h-3" />
                      <span className="capitalize">{user.workoutType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleAddFriend(user)}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Add Friend
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleChat(user)}
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindWorkoutMatch;
