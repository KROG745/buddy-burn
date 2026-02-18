import { useState, useEffect } from "react";
import { Users, MapPin, Dumbbell, UserPlus, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/contexts/ConversationContext";
import { supabase } from "@/integrations/supabase/client";

interface MatchedUser {
  id: string;
  name: string;
  avatar: string;
  workoutType: string;
  location: string;
  time: string;
  fitnessLevel: string;
  isOnline: boolean;
  workoutDate?: string;
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
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchMatches();
    }
  }, [open, workoutLocation, workoutType, workoutDate]);

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Please log in to find workout matches");
        setIsLoading(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke("find-workout-matches", {
        body: {
          workout_type: workoutType,
          location: workoutLocation,
          date: workoutDate,
        },
      });

      if (fnError) throw fnError;
      setMatchedUsers(data?.matches || []);
    } catch (err: any) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (user: MatchedUser) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast.error("Please log in to send friend requests");
        return;
      }

      const { error } = await supabase.from("friend_requests").insert({
        sender_id: currentUser.id,
        receiver_id: user.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast.info("Friend request already sent!");
        } else {
          throw error;
        }
      } else {
        toast.success(`Friend request sent to ${user.name}!`);
      }
    } catch (err: any) {
      console.error("Error sending friend request:", err);
      toast.error("Failed to send friend request");
    }
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Searching for workout buddies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={fetchMatches}>
                Try Again
              </Button>
            </div>
          ) : matchedUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No matches found</p>
              <p className="text-xs mt-1">No public profiles with similar workouts nearby</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {matchedUsers.length} matching profile{matchedUsers.length !== 1 ? "s" : ""} found
              </p>

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
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.fitnessLevel}</p>
                          </div>
                        </div>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindWorkoutMatch;
