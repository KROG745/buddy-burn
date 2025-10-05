import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Target, Plus, Edit, Trash2, MapPin, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import LocationFinder from "@/components/LocationFinder";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { useExerciseGenerator, Exercise } from "@/hooks/useExerciseGenerator";
import { format, isSameDay, startOfWeek, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, getWorkoutsForDate } = useWorkouts();
  const { shareWorkout } = useWorkoutShares();
  const { exercises, generateExercises } = useExerciseGenerator();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [locationTab, setLocationTab] = useState("manual");
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    title: "",
    type: "",
    subType: "",
    time: "",
    duration: "",
    goal: "",
    location: "",
    notes: "",
    date: selectedDate,
    intensity: "medium" as 'low' | 'medium' | 'high',
    publishToFeed: false,
    shareCaption: ""
  });

  const workoutSubTypes: Record<string, { value: string; label: string }[]> = {
    "Cardio": [
      { value: "running", label: "Running" },
      { value: "cycling", label: "Cycling" },
      { value: "swimming", label: "Swimming" },
      { value: "rowing", label: "Rowing" },
      { value: "elliptical", label: "Elliptical" },
      { value: "stair-climbing", label: "Stair Climbing" },
    ],
    "Weight Training": [
      { value: "chest", label: "Chest" },
      { value: "shoulders", label: "Shoulders" },
      { value: "legs", label: "Legs" },
      { value: "back", label: "Back" },
      { value: "arms", label: "Arms" },
      { value: "abs", label: "Abs/Core" },
      { value: "full-body", label: "Full Body" },
    ],
    "Yoga": [
      { value: "vinyasa", label: "Vinyasa" },
      { value: "hatha", label: "Hatha" },
      { value: "power-yoga", label: "Power Yoga" },
      { value: "yin-yoga", label: "Yin Yoga" },
      { value: "restorative", label: "Restorative" },
    ],
    "HIIT": [
      { value: "tabata", label: "Tabata" },
      { value: "circuit-training", label: "Circuit Training" },
      { value: "interval-training", label: "Interval Training" },
      { value: "hiit", label: "General HIIT" },
    ],
    "Pilates": [
      { value: "mat-pilates", label: "Mat Pilates" },
      { value: "reformer", label: "Reformer" },
      { value: "barre", label: "Barre" },
      { value: "pilates", label: "General Pilates" },
    ],
    "Boxing": [
      { value: "heavy-bag", label: "Heavy Bag" },
      { value: "speed-bag", label: "Speed Bag" },
      { value: "mitt-work", label: "Mitt Work" },
      { value: "shadow-boxing", label: "Shadow Boxing" },
      { value: "boxing", label: "General Boxing" },
    ],
  };
  const handleLocationSelect = (location: string) => {
    setNewWorkout({...newWorkout, location});
  };

  const handleTypeChange = (type: string) => {
    setNewWorkout({...newWorkout, type, subType: ""});
  };

  const handleSubTypeChange = (subType: string) => {
    setNewWorkout({...newWorkout, subType});
    generateExercises(subType);
  };


  const handleEditWorkout = (workout: any) => {
    setEditingWorkoutId(workout.id);
    setNewWorkout({
      title: workout.title,
      type: workout.type,
      subType: "",
      time: workout.time,
      duration: workout.duration,
      goal: workout.goal,
      location: workout.location || "",
      notes: workout.notes || "",
      date: workout.date,
      intensity: workout.intensity,
      publishToFeed: false,
      shareCaption: ""
    });
    setIsDialogOpen(true);
  };

  const handleAddWorkout = () => {
    if (newWorkout.title && newWorkout.type && newWorkout.time && newWorkout.goal) {
      if (editingWorkoutId) {
        // Update existing workout
        updateWorkout(editingWorkoutId, {
          title: newWorkout.title,
          type: newWorkout.type,
          date: newWorkout.date,
          time: newWorkout.time,
          duration: newWorkout.duration,
          goal: newWorkout.goal,
          location: newWorkout.location,
          notes: newWorkout.notes,
          intensity: newWorkout.intensity as "low" | "medium" | "high"
        });
        
        toast({
          title: "Workout Updated! ✏️",
          description: `${newWorkout.type} workout has been updated successfully.`,
        });
      } else {
        // Add new workout
        const workoutId = Date.now().toString();
        
        addWorkout({
          title: newWorkout.title,
          type: newWorkout.type,
          date: newWorkout.date,
          time: newWorkout.time,
          duration: newWorkout.duration,
          goal: newWorkout.goal,
          location: newWorkout.location,
          notes: newWorkout.notes,
          intensity: newWorkout.intensity as "low" | "medium" | "high"
        });
        
        // If publishing to feed, share the workout
        if (newWorkout.publishToFeed) {
          shareWorkout({
            workout_id: workoutId,
            caption: newWorkout.shareCaption || `Scheduled ${newWorkout.type} workout for ${format(newWorkout.date, "PPP")} at ${newWorkout.time}`,
            is_public: true,
          });
          
          toast({
            title: "Workout Scheduled & Shared! 🎉",
            description: `${newWorkout.type} workout scheduled and shared to your feed!`,
          });
        } else {
          toast({
            title: "Workout Scheduled! 🎉",
            description: `${newWorkout.type} workout scheduled for ${format(newWorkout.date, "PPP")}`,
          });
        }
      }
      
      setNewWorkout({
        title: "",
        type: "",
        subType: "",
        time: "",
        duration: "",
        goal: "",
        location: "",
        notes: "",
        date: selectedDate,
        intensity: "medium" as 'low' | 'medium' | 'high',
        publishToFeed: false,
        shareCaption: ""
      });
      setEditingWorkoutId(null);
      setIsDialogOpen(false);
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "bg-green-500/20 text-green-700 border-green-200";
      case "medium": return "bg-yellow-500/20 text-yellow-700 border-yellow-200";
      case "high": return "bg-red-500/20 text-red-700 border-red-200";
      default: return "bg-gray-500/20 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Workout Schedule</h1>
              <p className="text-sm text-muted-foreground">Plan and track your fitness journey</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingWorkoutId ? 'Edit Workout' : 'Schedule New Workout'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <Label htmlFor="workout-date">Select Workout Date</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between text-left font-normal h-auto py-3",
                          !newWorkout.date && "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          <div>
                            <div className="font-semibold">
                              {newWorkout.date ? format(newWorkout.date, "EEEE, MMMM dd, yyyy") : "Choose a date"}
                            </div>
                            {newWorkout.date && (
                              <div className="text-xs text-muted-foreground">
                                Click to change date
                              </div>
                            )}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newWorkout.date}
                        onSelect={(date) => {
                          if (date) {
                            setNewWorkout({...newWorkout, date});
                            setIsDatePickerOpen(false);
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Workout Title</Label>
                    <Input
                      id="title"
                      placeholder="Morning Run"
                      value={newWorkout.title || ""}
                      onChange={(e) => setNewWorkout({...newWorkout, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newWorkout.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Weight Training">Weight Training</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Pilates">Pilates</SelectItem>
                        <SelectItem value="Boxing">Boxing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sub-type selection */}
                {newWorkout.type && workoutSubTypes[newWorkout.type] && (
                  <div>
                    <Label htmlFor="subType">Workout Style</Label>
                    <Select value={newWorkout.subType} onValueChange={handleSubTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workout style" />
                      </SelectTrigger>
                      <SelectContent>
                        {workoutSubTypes[newWorkout.type].map((subType) => (
                          <SelectItem key={subType.value} value={subType.value}>
                            {subType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Exercise Guide */}
                {exercises.length > 0 && (
                  <div className="space-y-3">
                    <Label>Exercise Guide</Label>
                    <div className="border border-border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-muted/30">
                      {exercises.map((exercise) => (
                        <div key={exercise.id} className="p-3 bg-card border border-border rounded-md">
                          <h4 className="font-semibold text-sm mb-2">{exercise.name}</h4>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {exercise.sets && <Badge variant="outline">Sets: {exercise.sets}</Badge>}
                            {exercise.reps && <Badge variant="outline">Reps: {exercise.reps}</Badge>}
                            {exercise.duration && <Badge variant="outline">Duration: {exercise.duration}</Badge>}
                            {exercise.rest && <Badge variant="outline">Rest: {exercise.rest}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Select onValueChange={(value) => setNewWorkout({...newWorkout, time: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                        <SelectItem value="6:30 AM">6:30 AM</SelectItem>
                        <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                        <SelectItem value="7:30 AM">7:30 AM</SelectItem>
                        <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                        <SelectItem value="8:30 AM">8:30 AM</SelectItem>
                        <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                        <SelectItem value="9:30 AM">9:30 AM</SelectItem>
                        <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                        <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                        <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                        <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                        <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                        <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                        <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                        <SelectItem value="1:30 PM">1:30 PM</SelectItem>
                        <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                        <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                        <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                        <SelectItem value="3:30 PM">3:30 PM</SelectItem>
                        <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                        <SelectItem value="4:30 PM">4:30 PM</SelectItem>
                        <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                        <SelectItem value="5:30 PM">5:30 PM</SelectItem>
                        <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                        <SelectItem value="6:30 PM">6:30 PM</SelectItem>
                        <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                        <SelectItem value="7:30 PM">7:30 PM</SelectItem>
                        <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                        <SelectItem value="8:30 PM">8:30 PM</SelectItem>
                        <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                        <SelectItem value="9:30 PM">9:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (min)</Label>
                     <Input
                       id="duration"
                       type="number"
                       placeholder="60"
                       value={newWorkout.duration || ""}
                       onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                     />
                  </div>
                </div>

                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <Select 
                    value={newWorkout.intensity} 
                    onValueChange={(value) => setNewWorkout({...newWorkout, intensity: value as "low" | "medium" | "high"})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Workout Goal</Label>
                  <Textarea
                    id="goal"
                    placeholder="What do you want to achieve?"
                    value={newWorkout.goal || ""}
                    onChange={(e) => setNewWorkout({...newWorkout, goal: e.target.value})}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Tabs value={locationTab} onValueChange={setLocationTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="search">Find Places</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="mt-4">
                      <Input
                        id="location"
                        placeholder="Gym, Park, Home..."
                        value={newWorkout.location || ""}
                        onChange={(e) => setNewWorkout({...newWorkout, location: e.target.value})}
                      />
                    </TabsContent>
                    
                    <TabsContent value="search" className="mt-4">
                      {locationTab === "search" && (
                        <LocationFinder onLocationSelect={handleLocationSelect} />
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Publish to Feed Section */}
                <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
                  <div className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Publish to Feed
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Share this workout with your friends
                      </p>
                    </div>
                    <Switch
                      checked={newWorkout.publishToFeed}
                      onCheckedChange={(checked) => setNewWorkout({...newWorkout, publishToFeed: checked})}
                    />
                  </div>

                  {newWorkout.publishToFeed && (
                    <div>
                      <Label htmlFor="shareCaption">Caption (Optional)</Label>
                      <Textarea
                        id="shareCaption"
                        placeholder="Add a caption for your workout post..."
                        value={newWorkout.shareCaption}
                        onChange={(e) => setNewWorkout({...newWorkout, shareCaption: e.target.value})}
                        rows={2}
                        className="resize-none mt-2"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={handleAddWorkout} className="w-full">
                  Schedule Workout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>


        {/* Enhanced Workout Log */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            All Workouts
          </h3>
          
          {workouts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No workouts scheduled yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workout
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <Card key={workout.id} className={cn(
                  "p-6 transition-all duration-200 hover:shadow-lg",
                  workout.completed && "bg-green-50/50 border-green-200"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {workout.completed && (
                            <div className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                          <h4 className={cn(
                            "text-lg font-semibold",
                            workout.completed ? "text-green-700" : "text-foreground"
                          )}>
                            {workout.title}
                          </h4>
                        </div>
                        <Badge variant="outline" className={getIntensityColor(workout.intensity)}>
                          {workout.intensity}
                        </Badge>
                        <Badge variant="secondary">{workout.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{workout.time} ({workout.duration} min)</span>
                        </div>
                        
                        {workout.location && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{workout.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-start space-x-2 mb-3">
                        <Target className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Goal:</p>
                          <p className="text-sm text-muted-foreground">{workout.goal}</p>
                        </div>
                      </div>
                      
                      {workout.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md mb-3">
                          <strong>Notes:</strong> {workout.notes}
                        </div>
                      )}

                      {workout.completed && workout.completedAt && (
                        <div className="text-xs text-green-600 bg-green-100 p-2 rounded-md">
                          Completed at {format(workout.completedAt, "h:mm a")}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {!workout.completed ? (
                        <Button 
                          onClick={() => updateWorkout(workout.id, { 
                            completed: true, 
                            completedAt: new Date() 
                          })}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                          size="default"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => updateWorkout(workout.id, { 
                            completed: false, 
                            completedAt: undefined 
                          })}
                          variant="outline"
                          size="default"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      )}
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditWorkout(workout)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteWorkout(workout.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Schedule;