import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Flame, Award } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";
import { Skeleton } from "@/components/ui/skeleton";

const AchievementsDisplay = () => {
  const { achievements, isLoading } = useAchievements();

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      trophy: <Trophy className="w-5 h-5" />,
      target: <Target className="w-5 h-5" />,
      flame: <Flame className="w-5 h-5" />,
      award: <Award className="w-5 h-5" />,
    };
    return icons[iconName.toLowerCase()] || <Award className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'milestone':
        return 'bg-fitness-warning/10 text-fitness-warning border-fitness-warning/20';
      case 'streak':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'goal':
        return 'bg-fitness-success/10 text-fitness-success border-fitness-success/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No achievements yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Complete workouts to unlock achievements!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.slice(0, 4).map((achievement) => (
        <Card
          key={achievement.id}
          className="p-4 hover:shadow-elevation transition-all duration-300 border-2 neon-hover bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              {getIcon(achievement.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                <Badge variant="outline" className={getTypeColor(achievement.type)}>
                  {achievement.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AchievementsDisplay;
