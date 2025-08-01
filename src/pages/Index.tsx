import FitnessLogo from "@/components/FitnessLogo";
import Navigation from "@/components/Navigation";
import QuickActions from "@/components/QuickActions";
import StatsOverview from "@/components/StatsOverview";
import ActivityCard from "@/components/ActivityCard";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Mock data for activities
  const activities = [
    {
      userName: "Sarah Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612d5b1?w=100&h=100&fit=crop&crop=face",
      activityType: "Morning Run",
      duration: "45 min",
      distance: "5.2 km",
      location: "Central Park",
      timeAgo: "2 hours ago",
      likes: 12,
      comments: 3
    },
    {
      userName: "Mike Chen",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      activityType: "Strength Training",
      duration: "60 min",
      distance: "Gym Session",
      location: "Fitness Plus Gym",
      timeAgo: "4 hours ago",
      likes: 8,
      comments: 2
    },
    {
      userName: "Emma Wilson",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      activityType: "Yoga Flow",
      duration: "30 min",
      distance: "Studio Class",
      location: "Zen Yoga Studio",
      timeAgo: "6 hours ago",
      likes: 15,
      comments: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground p-6 shadow-elevation">
        <div className="flex items-center justify-between mb-4">
          <FitnessLogo className="text-primary-foreground" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, Alex!</h1>
          <p className="text-primary-foreground/80">Ready for today's workout?</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Progress</h2>
          <StatsOverview />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Friends Activity */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Friends Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <ActivityCard key={index} {...activity} />
            ))}
          </div>
        </section>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;
