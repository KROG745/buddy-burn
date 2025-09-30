import { useState } from "react";
import { Camera, MapPin, Mail, Phone, Calendar, Award, Users, Star, Edit, Save, X } from "lucide-react";
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
import Navigation from "@/components/Navigation";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  birthDate: string;
  fitnessLevel: string;
  goals: string[];
  interests: string[];
  isTrainer: boolean;
  trainerInfo?: {
    specialties: string[];
    experience: string;
    certifications: string[];
    hourlyRate: string;
    availability: string;
  };
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Passionate about fitness and helping others achieve their health goals. Love outdoor activities and strength training.",
    birthDate: "1990-05-15",
    fitnessLevel: "Intermediate",
    goals: ["Weight Loss", "Muscle Building", "Endurance"],
    interests: ["Running", "Weightlifting", "Yoga", "Hiking", "Nutrition"],
    isTrainer: false,
    trainerInfo: {
      specialties: [],
      experience: "",
      certifications: [],
      hourlyRate: "",
      availability: ""
    }
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const fitnessLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const commonGoals = ["Weight Loss", "Muscle Building", "Endurance", "Flexibility", "General Health"];
  const commonInterests = ["Running", "Weightlifting", "Yoga", "Pilates", "CrossFit", "Swimming", "Cycling", "Boxing", "Martial Arts", "Dancing", "Hiking", "Rock Climbing", "Nutrition", "Meditation"];
  const trainerSpecialties = ["Personal Training", "Group Fitness", "Yoga Instruction", "Nutrition Coaching", "Strength Training", "Cardio Training", "Rehabilitation", "Sports Performance"];

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = editedProfile.goals;
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setEditedProfile({ ...editedProfile, goals: updatedGoals });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = editedProfile.interests;
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    setEditedProfile({ ...editedProfile, interests: updatedInterests });
  };

  const toggleSpecialty = (specialty: string) => {
    if (!editedProfile.trainerInfo) return;
    const currentSpecialties = editedProfile.trainerInfo.specialties;
    const updatedSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];
    setEditedProfile({
      ...editedProfile,
      trainerInfo: { ...editedProfile.trainerInfo, specialties: updatedSpecialties }
    });
  };

  const currentProfile = isEditing ? editedProfile : profile;

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

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                  {currentProfile.name.split(' ').map(n => n[0]).join('')}
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
                />
              </div>
            ) : (
              <h2 className="text-xl font-bold text-foreground">{currentProfile.name}</h2>
            )}
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {isEditing ? (
                <Input
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                  className="text-center"
                />
              ) : (
                <span>{currentProfile.location}</span>
              )}
            </div>
            
            <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
              {currentProfile.fitnessLevel}
            </Badge>
          </div>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="trainer">Trainer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{currentProfile.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{currentProfile.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>Birth Date</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedProfile.birthDate}
                        onChange={(e) => setEditedProfile({ ...editedProfile, birthDate: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{new Date(currentProfile.birthDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
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
                    <p className="mt-1 text-muted-foreground">{currentProfile.bio}</p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="fitness" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Fitness Goals</h3>
              <div className="flex flex-wrap gap-2">
                {commonGoals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={currentProfile.goals.includes(goal) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      isEditing ? "hover:scale-105" : ""
                    } ${currentProfile.goals.includes(goal) ? "bg-gradient-primary text-primary-foreground" : ""}`}
                    onClick={() => isEditing && toggleGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {commonInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={currentProfile.interests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      isEditing ? "hover:scale-105" : ""
                    } ${currentProfile.interests.includes(interest) ? "bg-fitness-accent/20 text-fitness-accent border-fitness-accent" : ""}`}
                    onClick={() => isEditing && toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainer" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Trainer Profile</h3>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="trainer-toggle">I'm a Trainer</Label>
                    <Switch
                      id="trainer-toggle"
                      checked={editedProfile.isTrainer}
                      onCheckedChange={(checked) => 
                        setEditedProfile({ ...editedProfile, isTrainer: checked })
                      }
                    />
                  </div>
                )}
              </div>
              
              {currentProfile.isTrainer ? (
                <div className="space-y-4">
                  <div>
                    <Label>Specialties</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {trainerSpecialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant={currentProfile.trainerInfo?.specialties.includes(specialty) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            isEditing ? "hover:scale-105" : ""
                          } ${currentProfile.trainerInfo?.specialties.includes(specialty) ? "bg-fitness-success/20 text-fitness-success border-fitness-success" : ""}`}
                          onClick={() => isEditing && toggleSpecialty(specialty)}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Experience</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.trainerInfo?.experience || ""}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          trainerInfo: { ...editedProfile.trainerInfo!, experience: e.target.value }
                        })}
                        placeholder="Describe your training experience..."
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-muted-foreground">
                        {currentProfile.trainerInfo?.experience || "No experience added yet."}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Hourly Rate</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.trainerInfo?.hourlyRate || ""}
                          onChange={(e) => setEditedProfile({
                            ...editedProfile,
                            trainerInfo: { ...editedProfile.trainerInfo!, hourlyRate: e.target.value }
                          })}
                          placeholder="$50/hour"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-muted-foreground">
                          {currentProfile.trainerInfo?.hourlyRate || "Not specified"}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Availability</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.trainerInfo?.availability || ""}
                          onChange={(e) => setEditedProfile({
                            ...editedProfile,
                            trainerInfo: { ...editedProfile.trainerInfo!, availability: e.target.value }
                          })}
                          placeholder="Mon-Fri 6AM-8PM"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-muted-foreground">
                          {currentProfile.trainerInfo?.availability || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">Become a Trainer</h4>
                  <p className="text-muted-foreground mb-4">
                    Share your expertise and help others achieve their fitness goals.
                  </p>
                  {isEditing && (
                    <Button
                      onClick={() => setEditedProfile({ ...editedProfile, isTrainer: true })}
                      variant="outline"
                    >
                      Enable Trainer Profile
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;