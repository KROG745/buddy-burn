import { Clock, MapPin, Calendar, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/contexts/ConversationContext";
import { useToast } from "@/hooks/use-toast";

const SocialFeed = () => {
  const { shares, isLoading } = useWorkoutShares();
  const { workouts } = useWorkouts();
  const navigate = useNavigate();
  const { addConversation } = useConversations();
  const { toast } = useToast();
  
  // Fetch scheduled workout details using secure RPC function (masks location for non-friends)
  const { data: workoutDetails } = useQuery({
    queryKey: ['workout-details-social', shares],
    queryFn: async () => {
      if (!shares || shares.length === 0) return [];
      
      const workoutIds = shares.map(share => share.workout_id);
      const { data } = await supabase
        .rpc('get_shared_workout_details', { p_workout_ids: workoutIds });
      
      return data || [];
    },
    enabled: shares.length > 0,
  });
  
  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['current-user-social'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });
  
  const handleStartConversation = (activity: any) => {
    if (!activity.userName || !activity.workoutData) return;
    
    const workout = activity.workoutData;
    const message = `Hi! I saw your ${workout.type} workout scheduled at ${workout.location}${workout.time ? ` on ${workout.time}` : ''}. Would it be okay if I joined you?`;
    
    // Add or update conversation
    addConversation({
      id: activity.userId || activity.id,
      name: activity.userName,
      avatar: activity.userAvatar || '',
      lastMessage: message,
      timestamp: 'Just now',
      unreadCount: 0,
      isOnline: true,
    });
    
    // Navigate to chat with pre-filled message
    navigate(`/chat/${activity.userId || activity.id}?iceBreaker=${encodeURIComponent(message)}`);
    
    toast({
      title: "Starting conversation",
      description: `Opening chat with ${activity.userName}`,
    });
  };

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return 'bg-fitness-warning/10 text-fitness-warning';
      case 'strength':
      case 'weight training':
        return 'bg-fitness-success/10 text-fitness-success';
      case 'flexibility':
      case 'yoga':
        return 'bg-fitness-accent/10 text-fitness-accent';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-fitness-warning/10 text-fitness-warning';
      case 'low':
        return 'bg-fitness-success/10 text-fitness-success';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  // Demo data for showcase
  const demoSharedActivities = [
    {
      id: 'demo-1',
      userId: 'demo-user-1',
      type: 'shared',
      userName: 'Sarah Runner',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      workoutData: {
        type: 'Cardio',
        title: 'Cardio Workout',
        duration: '45',
        location: 'Central Park - Main Loop',
        intensity: 'medium',
        time: '7:00 AM',
      },
      caption: 'Who wants to join me for a morning run? Perfect weather tomorrow! 🌤️',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: 'demo-2',
      userId: 'demo-user-2',
      type: 'shared',
      userName: 'Mike Strong',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      workoutData: {
        type: 'Weight Training',
        title: 'Weight Training Workout',
        duration: '60',
        location: 'Gold\'s Gym Downtown',
        intensity: 'high',
        time: '6:00 PM',
      },
      caption: 'Chest and triceps at Gold\'s tonight! Looking for a workout partner 💪',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 'demo-3',
      userId: 'demo-user-3',
      type: 'shared',
      userName: 'Emma Yoga',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      workoutData: {
        type: 'Yoga',
        title: 'Yoga Workout',
        duration: '60',
        location: 'Sunset Beach',
        intensity: 'low',
        time: '8:00 AM',
      },
      caption: 'Sunrise yoga on the beach tomorrow! All levels welcome 🧘‍♀️',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    }
  ];

  // Combine local completed workouts with scheduled shared workouts
  const localActivities = workouts
    .filter(w => w.completed)
    .map(activity => ({
      id: activity.id,
      userId: undefined, // Local activity, no user ID
      type: 'local',
      userName: 'Alex (You)',
      userAvatar: '',
      workoutData: {
        type: activity.type,
        title: activity.title,
        duration: activity.duration,
        location: activity.location,
        intensity: activity.intensity,
        time: undefined as string | undefined,
      },
      caption: activity.goal,
      createdAt: activity.completedAt || new Date(),
    }));

  const sharedActivities = shares.map(share => {
    const scheduledWorkout = workoutDetails?.find(w => w.id === share.workout_id);
    if (!scheduledWorkout) return null;
    
    return {
      id: share.id,
      userId: share.user_id,
      type: 'shared',
      userName: share.profiles?.display_name || 'User',
      userAvatar: share.profiles?.avatar_url,
      workoutData: {
        type: scheduledWorkout.workout_type,
        title: `${scheduledWorkout.workout_type} Workout`,
        duration: scheduledWorkout.duration,
        location: scheduledWorkout.location, // Location already masked by RPC function
        intensity: scheduledWorkout.intensity,
        time: scheduledWorkout.time,
      },
      caption: share.caption,
      createdAt: new Date(share.created_at),
    };
  }).filter(Boolean);

  const allActivities = [...localActivities, ...sharedActivities, ...demoSharedActivities]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  if (allActivities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No activities to show.</p>
        <p className="text-sm text-muted-foreground mt-1">Complete and share workouts to see them here!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden">
      {allActivities.map((activity) => {
        if (!activity.workoutData) return null;
        
        return (
          <Card key={activity.id} className="p-4 hover:shadow-elevation transition-all duration-300 neon-hover border-border/50 overflow-hidden">
            <div className="flex items-start gap-3 w-full">
              <Avatar className="w-10 h-10 ring-2 ring-primary/20 shrink-0">
                <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {activity.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-semibold text-foreground truncate">{activity.userName}</span>
                  <Badge variant="secondary" className={`${getActivityTypeColor(activity.workoutData.type)} shrink-0`}>
                    {activity.workoutData.type}
                  </Badge>
                  <Badge variant="outline" className={`${getIntensityColor(activity.workoutData.intensity)} shrink-0`}>
                    {activity.workoutData.intensity}
                  </Badge>
                </div>
                
                <h3 className="font-medium text-foreground mb-2 break-words">{activity.workoutData.title}</h3>
                
                <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      {activity.workoutData.time ? `${activity.workoutData.time} • ` : ''}
                      {activity.workoutData.duration} min
                    </span>
                  </div>
                  {activity.workoutData.location && (
                    <div className="flex items-start gap-1">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="break-words">{activity.workoutData.location}</span>
                    </div>
                  )}
                </div>
                
                {activity.caption && (
                  <p className="text-sm text-muted-foreground mb-3 italic">"{activity.caption}"</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(activity.createdAt, { addSuffix: true })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Show join button only if it's not the current user's workout */}
                    {currentUser && activity.userId && activity.userId !== currentUser.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleStartConversation(activity)}
                      >
                        <UserPlus className="w-3 h-3" />
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-xs">Join</span>
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" className="h-8 gap-1 hover:text-fitness-accent">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 hover:text-fitness-electric">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">0</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SocialFeed;
