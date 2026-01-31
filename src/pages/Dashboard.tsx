import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FitnessLogo from "@/components/FitnessLogo";
import StatsOverview from "@/components/StatsOverview";
import QuickActions from "@/components/QuickActions";
import SocialFeed from "@/components/SocialFeed";
import AchievementsDisplay from "@/components/AchievementsDisplay";
import Navigation from "@/components/Navigation";
import ConversationsList from "@/components/ConversationsList";
import AchievementNotification from "@/components/AchievementNotification";
import { useAchievementSystem } from "@/hooks/useAchievementSystem";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { newAchievements, clearAchievementNotification } = useAchievementSystem();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground p-6 shadow-elevation animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <FitnessLogo className="text-primary-foreground drop-shadow-lg" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20 hover:shadow-glow">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20 hover:shadow-glow">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:bg-white/20 hover:shadow-glow">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1 drop-shadow-md">Welcome back, Alex!</h1>
            <p className="text-primary-foreground/90 drop-shadow-sm">Ready for today's workout?</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6 overflow-hidden">
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
      
      {/* Achievement Notifications */}
      {newAchievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => clearAchievementNotification(achievement.id)}
        />
      ))}
    </div>
  );
};

export default Index;
