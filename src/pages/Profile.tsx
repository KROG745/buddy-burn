import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, LogOut, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import AchievementsList from "@/components/AchievementsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [editedData, setEditedData] = useState({
    display_name: "",
    bio: "",
    fitness_goal: "",
    experience_level: ""
  });

  useEffect(() => {
    if (profile) {
      setEditedData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        fitness_goal: profile.fitness_goal || "",
        experience_level: profile.experience_level || "Beginner"
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await updateProfile(editedData);
    if (result?.success) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        fitness_goal: profile.fitness_goal || "",
        experience_level: profile.experience_level || "Beginner"
      });
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-hero text-primary-foreground p-6 shadow-elevation">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-primary-foreground hover:bg-white/20"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-primary-foreground hover:bg-white/20"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-primary-foreground hover:bg-white/20"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6 space-y-6">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                  {profile.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <Input
                value={editedData.display_name}
                onChange={(e) => setEditedData({ ...editedData, display_name: e.target.value })}
                className="text-center text-xl font-bold max-w-sm"
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-xl font-bold">{profile.display_name || 'User'}</h2>
            )}
            
            <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
              {editedData.experience_level}
            </Badge>
          </div>
        </Card>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="mt-1 text-muted-foreground">{user?.email}</p>
                </div>

                <div>
                  <Label>Username</Label>
                  <p className="mt-1 text-muted-foreground">@{profile.username}</p>
                </div>

                <div>
                  <Label>Experience Level</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.experience_level}
                      onChange={(e) => setEditedData({ ...editedData, experience_level: e.target.value })}
                      placeholder="e.g., Beginner, Intermediate, Advanced"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">
                      {profile.experience_level || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Fitness Goal</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.fitness_goal}
                      onChange={(e) => setEditedData({ ...editedData, fitness_goal: e.target.value })}
                      placeholder="e.g., Weight Loss, Muscle Gain, Endurance"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">
                      {profile.fitness_goal || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedData.bio}
                      onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">
                      {profile.bio || 'No bio yet'}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </Card>
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

export default Profile;
