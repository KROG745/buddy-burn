import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
    <div className="min-h-screen bg-background pb-[83px]">
      {/* iOS Status Bar Space */}
      <div className="h-[env(safe-area-inset-top)] bg-primary" />
      
      {/* iOS Navigation Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[28px] font-bold tracking-tight">Fitness</h1>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10 rounded-full w-9 h-9 ios-tap-highlight"
              >
                <Bell className="w-[22px] h-[22px]" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10 rounded-full w-9 h-9 ios-tap-highlight"
              >
                <Settings className="w-[22px] h-[22px]" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10 rounded-full w-9 h-9 ios-tap-highlight"
              >
                <LogOut className="w-[22px] h-[22px]" />
              </Button>
            </div>
          </div>
          <p className="text-primary-foreground/80 text-[15px]">Ready for today's workout?</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 space-y-6">
        {/* Stats Overview */}
        <section>
          <h2 className="text-[22px] font-semibold text-foreground mb-3">Your Progress</h2>
          <StatsOverview />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-[22px] font-semibold text-foreground mb-3">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-[22px] font-semibold text-foreground mb-3">Recent Achievements</h2>
          <AchievementsDisplay />
        </section>

        {/* Social Feed */}
        <section>
          <h2 className="text-[22px] font-semibold text-foreground mb-3">Activity Feed</h2>
          <SocialFeed />
        </section>

        {/* Recent Conversations */}
        <section>
          <h2 className="text-[22px] font-semibold text-foreground mb-3">Recent Conversations</h2>
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