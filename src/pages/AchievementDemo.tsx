import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AchievementNotification from "@/components/AchievementNotification";
import AchievementsDisplay from "@/components/AchievementsDisplay";

const sampleAchievements = [
  {
    id: "first_workout",
    title: "First Steps",
    description: "Complete your first workout",
    icon: "🎯",
    category: "milestone",
    rarity: "common",
    points: 10,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "7-day workout streak",
    icon: "⚡",
    category: "streak",
    rarity: "rare",
    points: 35,
  },
  {
    id: "100_workouts",
    title: "Century Club",
    description: "Complete 100 workouts",
    icon: "👑",
    category: "milestone",
    rarity: "epic",
    points: 250,
  },
  {
    id: "all_workout_types",
    title: "Jack of All Trades",
    description: "Try all workout types",
    icon: "🌈",
    category: "variety",
    rarity: "legendary",
    points: 100,
  },
];

const AchievementDemo = () => {
  const [notifications, setNotifications] = useState<typeof sampleAchievements>([]);

  const showNotification = (achievement: typeof sampleAchievements[0]) => {
    setNotifications((prev) => [...prev, achievement]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Achievement System Demo</h1>
          <p className="text-muted-foreground">
            Try triggering different achievement notifications to see how they look!
          </p>
        </div>

        {/* Notification Triggers */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trigger Achievement Notifications</h2>
          <p className="text-muted-foreground mb-6">
            Click these buttons to see what notifications look like for different rarity levels:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleAchievements.map((achievement) => (
              <Button
                key={achievement.id}
                onClick={() => showNotification(achievement)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-semibold">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.rarity.toUpperCase()} • +{achievement.points} points
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Achievements Display Demo */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Achievements Display</h2>
          <p className="text-muted-foreground mb-4">
            This is what your earned achievements look like on the dashboard:
          </p>
          <AchievementsDisplay />
        </div>

        {/* Feature Overview */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">🎯 17 Achievements Available</h3>
              <p>
                Workout milestones (1, 10, 25, 50, 100 workouts), streaks (3, 7, 14, 30 days),
                social achievements (friends, shares), and variety achievements (trying different
                workout types).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">📊 Automatic Tracking</h3>
              <p>
                Your progress is tracked automatically. Complete workouts, maintain streaks, add
                friends, and share workouts to unlock achievements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">🎨 Rarity Tiers</h3>
              <p>
                Achievements have different rarity levels (Common, Rare, Epic, Legendary) with
                unique colors and point values.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">⚡ Real-time Notifications</h3>
              <p>
                Get instant animated notifications when you unlock achievements, with sparkle
                effects and auto-dismiss after 5 seconds.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">🏆 Points & Levels</h3>
              <p>
                Earn points for each achievement. Every 100 points = 1 level up. Track your total
                points and level in your stats.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Render Notifications */}
      {notifications.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => clearNotification(achievement.id)}
        />
      ))}
    </div>
  );
};

export default AchievementDemo;
