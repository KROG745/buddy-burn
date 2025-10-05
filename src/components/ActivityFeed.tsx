import { Clock, MapPin, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ActivityFeed = () => {
  const { shares, isLoading } = useWorkoutShares();
  
  // Fetch scheduled workout details for each share
  const { data: workoutDetails } = useQuery({
    queryKey: ['workout-details', shares],
    queryFn: async () => {
      if (!shares || shares.length === 0) return [];
      
      const workoutIds = shares.map(share => share.workout_id);
      const { data } = await supabase
        .from('scheduled_workouts')
        .select('*')
        .in('id', workoutIds);
      
      return data || [];
    },
    enabled: shares.length > 0,
  });
  
  // Combine shares with workout details
  const recentActivities = shares.map(share => {
    const workout = workoutDetails?.find(w => w.id === share.workout_id);
    return {
      id: share.id,
      user: share.profiles,
      caption: share.caption,
      createdAt: share.created_at,
      workout,
    };
  }).filter(activity => activity.workout);

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
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Loading activities...</p>
      </Card>
    );
  }

  if (recentActivities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No recent activities to show.</p>
        <p className="text-sm text-muted-foreground mt-1">Schedule workouts to see them here!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => {
        const workout = activity.workout;
        if (!workout) return null;
        
        return (
          <Card key={activity.id} className="p-4 hover:shadow-elevation transition-all duration-300">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.user?.avatar_url || ""} alt={activity.user?.display_name || "User"} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {activity.user?.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">
                    {activity.user?.display_name || 'User'}
                  </span>
                  <Badge variant="secondary" className={getActivityTypeColor(workout.workout_type)}>
                    {workout.workout_type}
                  </Badge>
                  <Badge variant="outline" className={getIntensityColor(workout.intensity || 'medium')}>
                    {workout.intensity || 'medium'}
                  </Badge>
                </div>
                
                {activity.caption && (
                  <p className="text-sm text-foreground mb-2">{activity.caption}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.time} • {workout.duration} min</span>
                  </div>
                  {workout.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{workout.location}</span>
                    </div>
                  )}
                </div>
                
                {workout.notes && (
                  <p className="text-sm text-muted-foreground mb-2 italic">"{workout.notes}"</p>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ActivityFeed;