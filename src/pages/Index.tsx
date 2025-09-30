import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import FitnessLogo from "@/components/FitnessLogo";
import StatsOverview from "@/components/StatsOverview";
import QuickActions from "@/components/QuickActions";
import SocialFeed from "@/components/SocialFeed";
import AchievementsDisplay from "@/components/AchievementsDisplay";
import Navigation from "@/components/Navigation";
import ConversationsList from "@/components/ConversationsList";

const Index = () => {

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

        {/* Achievements */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h2>
          <AchievementsDisplay />
        </section>

        {/* Social Feed */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Activity Feed</h2>
          <SocialFeed />
        </section>

        {/* Recent Conversations */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Conversations</h2>
          <ConversationsList showSearch={false} maxItems={4} />
        </section>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;
