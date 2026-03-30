import { useState, useEffect } from "react";
import { Camera, MapPin, Mail, Phone, Calendar, Award, Users, Star, Edit, Save, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  fitnessGoal: string;
  experienceLevel: string;
  isPublic: boolean;
  hideLocationFromFriends: boolean;
  avatarUrl: string;
}

const experienceLevels = ["beginner", "intermediate", "advanced", "expert"];
const commonGoals = ["Weight Loss", "Muscle Building", "Endurance", "Flexibility", "General Health", "Build strength and stay active"];

const defaultProfile: UserProfile = {
  name: "",
  username: "",
  email: "",
  bio: "",
  fitnessGoal: "",
  experienceLevel: "",
  isPublic: false,
  hideLocationFromFriends: false,
  avatarUrl: "",
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const loaded: UserProfile = {
        name: data.display_name || "",
        username: data.username || "",
        email: user.email || "",
        bio: data.bio || "",
        fitnessGoal: data.fitness_goal || "",
        experienceLevel: data.experience_level || "",
        isPublic: data.is_public ?? false,
        hideLocationFromFriends: data.hide_location_from_friends ?? false,
        avatarUrl: data.avatar_url || "",
      };

      setProfile(loaded);
      setEditedProfile(loaded);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: editedProfile.name.trim(),
          username: editedProfile.username.trim(),
          bio: editedProfile.bio.trim(),
          fitness_goal: editedProfile.fitnessGoal.trim(),
          experience_level: editedProfile.experienceLevel,
          is_public: editedProfile.isPublic,
          hide_location_from_friends: editedProfile.hideLocationFromFriends,
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const currentProfile = isEditing ? editedProfile : profile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
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
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-primary-foreground hover:bg-white/20"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentProfile.avatarUrl} alt="Profile" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                  {currentProfile.name ? currentProfile.name.split(' ').map(n => n[0]).join('') : '?'}
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
              <div className="w-full max-w-sm space-y-2">
                <Input
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="text-center text-xl font-bold"
                  placeholder="Your display name"
                />
              </div>
            ) : (
              <h2 className="text-xl font-bold text-foreground">{currentProfile.name || "No name set"}</h2>
            )}

            <p className="text-sm text-muted-foreground">@{currentProfile.username || "username"}</p>
            
            {currentProfile.experienceLevel && (
              <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground capitalize">
                {currentProfile.experienceLevel}
              </Badge>
            )}
          </div>
        </Card>

        {/* Profile Completion Prompt */}
        {(() => {
          const fields = [
            { label: "Bio", done: !!currentProfile.bio.trim() },
            { label: "Fitness Goal", done: !!currentProfile.fitnessGoal.trim() },
            { label: "Experience Level", done: !!currentProfile.experienceLevel },
            { label: "Display Name", done: !!currentProfile.name.trim() },
          ];
          const completed = fields.filter(f => f.done).length;
          const total = fields.length;
          const incomplete = fields.filter(f => !f.done);

          if (completed === total) return null;

          return (
            <Card className="p-4 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Complete Your Profile</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      A complete profile helps you connect with workout buddies and get better recommendations.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{completed} of {total} completed</span>
                      <span>{Math.round((completed / total) * 100)}%</span>
                    </div>
                    <Progress value={(completed / total) * 100} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {incomplete.map(f => (
                      <Badge key={f.label} variant="outline" className="text-xs border-primary/30 text-primary">
                        + {f.label}
                      </Badge>
                    ))}
                  </div>
                  {!isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-3 h-3 mr-1.5" />
                      Complete Now
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })()}

        {/* Privacy Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Profile Privacy</h3>
              <p className="text-sm text-muted-foreground">
                {currentProfile.isPublic 
                  ? "Your profile is visible to everyone" 
                  : "Your profile is only visible to your friends"}
              </p>
            </div>
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="privacy-toggle" className="text-sm">
                  {editedProfile.isPublic ? "Public" : "Private"}
                </Label>
                <Switch
                  id="privacy-toggle"
                  checked={editedProfile.isPublic}
                  onCheckedChange={(checked) => 
                    setEditedProfile({ ...editedProfile, isPublic: checked })
                  }
                />
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Privacy
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentProfile.hideLocationFromFriends 
                  ? "Friends see workout type/time but not your location" 
                  : "Friends can see your workout locations"}
              </p>
            </div>
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="location-privacy-toggle" className="text-sm">
                  {editedProfile.hideLocationFromFriends ? "Hidden" : "Visible"}
                </Label>
                <Switch
                  id="location-privacy-toggle"
                  checked={editedProfile.hideLocationFromFriends}
                  onCheckedChange={(checked) => 
                    setEditedProfile({ ...editedProfile, hideLocationFromFriends: checked })
                  }
                />
              </div>
            )}
          </div>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{currentProfile.email}</span>
                  </div>
                </div>

                <div>
                  <Label>Username</Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.username}
                      onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                      placeholder="your_username"
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">@{currentProfile.username || "Not set"}</p>
                  )}
                </div>
                
                <div>
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">{currentProfile.bio || "No bio yet. Tell others about yourself!"}</p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="fitness" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Experience Level</h3>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((level) => (
                  <Badge
                    key={level}
                    variant={currentProfile.experienceLevel === level ? "default" : "outline"}
                    className={`cursor-pointer transition-all capitalize ${
                      isEditing ? "hover:scale-105" : ""
                    } ${currentProfile.experienceLevel === level ? "bg-gradient-primary text-primary-foreground" : ""}`}
                    onClick={() => isEditing && setEditedProfile({ ...editedProfile, experienceLevel: level })}
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Fitness Goal</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {commonGoals.map((goal) => (
                      <Badge
                        key={goal}
                        variant={editedProfile.fitnessGoal === goal ? "default" : "outline"}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          editedProfile.fitnessGoal === goal ? "bg-gradient-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => setEditedProfile({ ...editedProfile, fitnessGoal: goal })}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                  <Input
                    value={editedProfile.fitnessGoal}
                    onChange={(e) => setEditedProfile({ ...editedProfile, fitnessGoal: e.target.value })}
                    placeholder="Or type your own goal..."
                    className="mt-2"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">{currentProfile.fitnessGoal || "No fitness goal set yet."}</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/30 bg-destructive/5 mt-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <DeleteAccountDialog />
        </Card>
      </main>
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;
