import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useProfile } from "@/hooks/useProfile";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AchievementsList from "@/components/AchievementsList";

const Social = () => {
  const { user } = useProfile();
  const { shares, loading } = useWorkoutShares(user?.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-hero text-primary-foreground p-6 shadow-elevation">
        <h1 className="text-2xl font-bold">Social Feed</h1>
        <p className="text-sm opacity-90">See what your friends are achieving</p>
      </header>

      <main className="p-6">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="feed">Activity Feed</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-24 bg-muted rounded" />
                  </Card>
                ))}
              </div>
            ) : shares.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No shared workouts yet. Complete and share workouts to see them here!
                </p>
              </Card>
            ) : (
              shares.map((share) => (
                <Card key={share.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={share.profiles?.avatar_url || undefined} />
                      <AvatarFallback>
                        {share.profiles?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {share.profiles?.display_name || 'User'}
                        </span>
                        {share.is_public ? (
                          <Badge variant="secondary">Public</Badge>
                        ) : (
                          <Badge variant="outline">Friends</Badge>
                        )}
                      </div>
                      
                      {share.caption && (
                        <p className="text-sm mb-3">{share.caption}</p>
                      )}
                      
                      <div className="bg-muted/50 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="font-medium">Workout Completed</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>ID: {share.workout_id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsList />
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Social;
