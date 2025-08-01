import { TrendingUp, Flame, Trophy, Users } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: "7",
      unit: "days",
      color: "text-fitness-warning",
      bgColor: "bg-fitness-warning/10"
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: "4",
      unit: "workouts",
      color: "text-fitness-success",
      bgColor: "bg-fitness-success/10"
    },
    {
      icon: Trophy,
      label: "Level",
      value: "12",
      unit: "athlete",
      color: "text-fitness-accent",
      bgColor: "bg-fitness-accent/10"
    },
    {
      icon: Users,
      label: "Friends",
      value: "23",
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