import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
      case 'epic':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/50';
      case 'rare':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/50';
      default:
        return 'from-green-500/20 to-emerald-500/20 border-green-500/50';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card
        className={`p-6 bg-gradient-to-br ${getRarityColor(
          achievement.rarity
        )} backdrop-blur-lg border-2 shadow-2xl max-w-sm relative overflow-hidden`}
      >
        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute top-4 right-4 w-3 h-3 text-yellow-400 animate-pulse delay-100" />
          <Sparkles className="absolute bottom-4 left-6 w-3 h-3 text-yellow-400 animate-pulse delay-200" />
        </div>

        {/* Content */}
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-4xl animate-scale-in border-2 border-primary/30">
              {achievement.icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Achievement Unlocked!
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
              {achievement.title}
              <Badge className={`${getRarityBadge(achievement.rarity)} text-xs`}>
                {achievement.rarity}
              </Badge>
            </h3>

            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>

            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="bg-primary/10">
                +{achievement.points} points
              </Badge>
              <Badge variant="outline">{achievement.category}</Badge>
            </div>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-glow animate-[slide-in-right_5s_ease-out]"
            style={{ animation: 'slide-out-right 5s ease-out' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default AchievementNotification;
