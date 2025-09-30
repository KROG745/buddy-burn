import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import FitnessLogo from "@/components/FitnessLogo";
import StatsOverview from "@/components/StatsOverview";
import QuickActions from "@/components/QuickActions";
import ActivityFeed from "@/components/ActivityFeed";
import Navigation from "@/components/Navigation";
import ConversationsList from "@/components/ConversationsList";
import NotificationCenter from "@/components/NotificationCenter";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  console.log("Index page rendering");
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  
  console.log("Index page state:", { hasProfile: !!profile, loading });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };
  
  console.log("Index about to render JSX");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground p-6 shadow-elevation">
        <div className="flex items-center justify-between mb-4">
          <FitnessLogo className="text-primary-foreground" />
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-white/20"
              onClick={() => navigate("/profile")}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {profile?.display_name || 'User'}!
          </h1>
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

        {/* Activities and Conversations */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activities Feed */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Activities</h2>
              <ActivityFeed />
            </div>
            
            {/* Recent Conversations */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Conversations</h2>
              <ConversationsList showSearch={false} maxItems={4} />
            </div>
          </div>
        </section>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;
