import { useEffect, useState } from "react";
import { TrendingUp, Flame, Trophy, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StatsOverview = () => {
  const [userStats, setUserStats] = useState<{
    current_streak: number;
    total_workouts: number;
    level: number;
    total_friends: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("user_stats")
        .select("current_streak, total_workouts, level, total_friends")
        .eq("user_id", session.user.id)
        .single();

      if (data) setUserStats(data);
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: userStats?.current_streak?.toString() ?? "0",
      unit: "days",
      color: "text-fitness-warning",
      bgColor: "bg-fitness-warning/10"
    },
    {
      icon: TrendingUp,
      label: "Workouts",
      value: userStats?.total_workouts?.toString() ?? "0",
      unit: "total",
      color: "text-fitness-success",
      bgColor: "bg-fitness-success/10"
    },
    {
      icon: Trophy,
      label: "Level",
      value: userStats?.level?.toString() ?? "1",
      unit: "athlete",
      color: "text-fitness-accent",
      bgColor: "bg-fitness-accent/10"
    },
    {
      icon: Users,
      label: "Friends",
      value: userStats?.total_friends?.toString() ?? "0",
      unit: "active",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-gradient-card rounded-lg p-4 shadow-card border border-border/50 hover:shadow-elevation transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.unit}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground mt-2">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
