import { useEffect, useState } from "react";
import { Users, MapPin, Clock, UserPlus, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface WorkoutBuddy {
  id: string;
  user_id: string;
  workout_type: string;
  time: string;
  duration: string;
  profile: {
    display_name: string;
    avatar_url: string | null;
    fitness_goal: string | null;
  };
  is_friend: boolean;
  has_pending_request: boolean;
}

interface WorkoutBuddiesProps {
  location: string;
  date: Date;
  workoutType: string;
  time?: string;
}

const WorkoutBuddies = ({ location, date, workoutType, time }: WorkoutBuddiesProps) => {
  const [buddies, setBuddies] = useState<WorkoutBuddy[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (location && date) {
      fetchWorkoutBuddies();
    }
  }, [location, date, workoutType, time]);

  const fetchWorkoutBuddies = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Normalize location for better matching
      const normalizedLocation = location.toLowerCase().trim();

      // Query for similar workouts
      const { data: workouts, error } = await supabase
        .from('scheduled_workouts')
        .select('id, user_id, workout_type, time, duration')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .ilike('location_normalized', `%${normalizedLocation}%`)
        .neq('user_id', user.id);

      if (error) throw error;

      // Fetch profile data for each user
      const userIds = workouts?.map(w => w.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, fitness_goal')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Check friend status for each user
      const { data: friendships } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      const { data: pendingRequests } = await supabase
        .from('friend_requests')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      const friendIds = new Set(friendships?.map(f => f.friend_id) || []);
      const pendingIds = new Set(pendingRequests?.map(r => r.receiver_id) || []);

      // Format the data
      const buddiesData: WorkoutBuddy[] = (workouts || [])
        .filter(w => profileMap.has(w.user_id))
        .map(workout => {
          const profile = profileMap.get(workout.user_id)!;
          return {
            id: workout.id,
            user_id: workout.user_id,
            workout_type: workout.workout_type,
            time: workout.time,
            duration: workout.duration,
            profile: {
              display_name: profile.display_name || 'User',
              avatar_url: profile.avatar_url,
              fitness_goal: profile.fitness_goal,
            },
            is_friend: friendIds.has(workout.user_id),
            has_pending_request: pendingIds.has(workout.user_id),
          };
        })
        // Sort by similar workout type and time
        .sort((a, b) => {
          if (a.workout_type === workoutType && b.workout_type !== workoutType) return -1;
          if (a.workout_type !== workoutType && b.workout_type === workoutType) return 1;
          if (time && a.time === time && b.time !== time) return -1;
          if (time && a.time !== time && b.time === time) return 1;
          return 0;
        });

      setBuddies(buddiesData);
    } catch (error) {
      console.error('Error fetching workout buddies:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Friend Request Sent! 👋",
        description: "You'll be notified when they accept.",
      });

      // Refresh the list
      fetchWorkoutBuddies();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Finding workout buddies...</span>
        </div>
      </Card>
    );
  }

  if (buddies.length === 0) {
    return (
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm">No other users found at this gym yet. Be the first!</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Potential Workout Buddies</h3>
        <Badge variant="secondary" className="ml-auto">{buddies.length}</Badge>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {buddies.map((buddy) => (
          <div
            key={buddy.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.profile.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {buddy.profile.display_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{buddy.profile.display_name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{buddy.time}</span>
                <span>•</span>
                <span className="capitalize">{buddy.workout_type}</span>
              </div>
              {buddy.profile.fitness_goal && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  Goal: {buddy.profile.fitness_goal}
                </p>
              )}
            </div>

            {buddy.is_friend ? (
              <Badge variant="outline" className="text-xs">
                Friends
              </Badge>
            ) : buddy.has_pending_request ? (
              <Badge variant="secondary" className="text-xs">
                Pending
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => sendFriendRequest(buddy.user_id)}
                className="h-8 px-2 gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span className="sr-only">Connect</span>
              </Button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2 border-t">
        💡 Connect with others to stay motivated and share your fitness journey!
      </p>
    </Card>
  );
};

export default WorkoutBuddies;
