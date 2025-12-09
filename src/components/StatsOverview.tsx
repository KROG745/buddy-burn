import { TrendingUp, Flame, Trophy, Users } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: "7",
      unit: "days",
      color: "text-[hsl(38_92%_50%)]",
      bgColor: "bg-[hsl(38_92%_50%/0.12)]"
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
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card rounded-xl p-4 shadow-[0_1px_3px_hsl(0_0%_0%/0.04)] ios-tap-highlight active:scale-[0.98] transition-transform duration-150"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-[24px] font-semibold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                  {stat.unit}
                </div>
              </div>
            </div>
            <div className="text-[13px] font-medium text-muted-foreground mt-2">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;