import { Trophy, Award, Target, Flame, Star, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAchievements } from "@/hooks/useAchievements";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";

const iconMap: Record<string, any> = {
  trophy: Trophy,
  award: Award,
  target: Target,
  flame: Flame,
  star: Star,
  zap: Zap,
};

const AchievementsList = () => {
  const { user } = useProfile();
  const { achievements, loading } = useAchievements(user?.id);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-16 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="font-semibold text-lg mb-2">No Achievements Yet</h3>
        <p className="text-muted-foreground">
          Complete workouts and reach milestones to earn achievements!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => {
        const Icon = iconMap[achievement.icon] || Trophy;
        return (
          <Card key={achievement.id} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{achievement.title}</h3>
                  <Badge variant="secondary">{achievement.type}</Badge>
                </div>
                <p className="text-muted-foreground mb-2">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">
                  Earned {formatDistanceToNow(new Date(achievement.earned_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AchievementsList;
