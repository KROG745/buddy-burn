import { Clock, MapPin, Calendar, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const SocialFeed = () => {
  const { shares, isLoading } = useWorkoutShares();
  const { workouts } = useWorkouts();

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return 'bg-fitness-warning/10 text-fitness-warning';
      case 'strength':
        return 'bg-fitness-success/10 text-fitness-success';
      case 'flexibility':
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

  // Combine local completed workouts with shared workouts
  const localActivities = workouts
    .filter(w => w.completed)
    .map(activity => ({
      id: activity.id,
      type: 'local',
      userName: 'Alex (You)',
      userAvatar: '',
      workout: activity,
      caption: activity.goal,
      createdAt: activity.completedAt || new Date(),
    }));

  const sharedActivities = shares.map(share => {
    const workout = workouts.find(w => w.id === share.workout_id);
    return {
      id: share.id,
      type: 'shared',
      userName: share.profiles?.display_name || 'User',
      userAvatar: share.profiles?.avatar_url,
      workout: workout,
      caption: share.caption,
      createdAt: new Date(share.created_at),
    };
  }).filter(a => a.workout);

  const allActivities = [...localActivities, ...sharedActivities]
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
    <div className="space-y-4">
      {allActivities.map((activity) => {
        if (!activity.workout) return null;
        
        return (
          <Card key={activity.id} className="p-4 hover:shadow-elevation transition-all duration-300 neon-hover border-border/50">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {activity.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">{activity.userName}</span>
                  <Badge variant="secondary" className={getActivityTypeColor(activity.workout.type)}>
                    {activity.workout.type}
                  </Badge>
                  <Badge variant="outline" className={getIntensityColor(activity.workout.intensity)}>
                    {activity.workout.intensity}
                  </Badge>
                </div>
                
                <h3 className="font-medium text-foreground mb-2">{activity.workout.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{activity.workout.duration} min</span>
                  </div>
                  {activity.workout.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{activity.workout.location}</span>
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
