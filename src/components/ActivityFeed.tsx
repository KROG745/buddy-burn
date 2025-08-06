import { Clock, MapPin, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = () => {
  const { getRecentActivities } = useWorkouts();
  const recentActivities = getRecentActivities();

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

  if (recentActivities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No recent activities to show.</p>
        <p className="text-sm text-muted-foreground mt-1">Complete some workouts to see them here!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <Card key={activity.id} className="p-4 hover:shadow-elevation transition-all duration-300">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                A
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">Alex (You)</span>
                <Badge variant="secondary" className={getActivityTypeColor(activity.type)}>
                  {activity.type}
                </Badge>
                <Badge variant="outline" className={getIntensityColor(activity.intensity)}>
                  {activity.intensity}
                </Badge>
              </div>
              
              <h3 className="font-medium text-foreground mb-2">{activity.title}</h3>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{activity.duration} min</span>
                </div>
                {activity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{activity.location}</span>
                  </div>
                )}
              </div>
              
              {activity.goal && (
                <p className="text-sm text-muted-foreground mb-2 italic">"{activity.goal}"</p>
              )}
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  {activity.completedAt 
                    ? formatDistanceToNow(activity.completedAt, { addSuffix: true })
                    : 'Recently completed'
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeed;