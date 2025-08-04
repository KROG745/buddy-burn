import { useState, useEffect } from "react";
import { Calendar, Clock, Target, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationFinder from "@/components/LocationFinder";
import ApiKeyInput from "@/components/ApiKeyInput";
import { format, isSameDay, startOfWeek, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface Workout {
  id: string;
  title: string;
  type: string;
  date: Date;
  time: string;
  duration: number;
  goal: string;
  location?: string;
  notes?: string;
  intensity: "low" | "medium" | "high";
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      title: "Morning Run",
      type: "Cardio",
      date: new Date(),
      time: "07:00",
      duration: 45,
      goal: "5km run under 25 minutes",
      location: "Central Park",
      intensity: "medium"
    },
    {
      id: "2",
      title: "Strength Training",
      type: "Weight Training",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "18:00",
      duration: 60,
      goal: "Upper body focus - bench press 3x8",
      location: "Fitness Center",
      intensity: "high"
    }
  ]);

  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    date: selectedDate,
    intensity: "medium"
  });
  const [googleApiKey, setGoogleApiKey] = useState<string>("");

  // Load Google API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('googleMapsApiKey');
    if (savedApiKey) {
      setGoogleApiKey(savedApiKey);
    }
  }, []);

  const handleLocationSelect = (location: string) => {
    setNewWorkout({...newWorkout, location});
  };

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout => isSameDay(workout.date, date));
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const handleAddWorkout = () => {
    if (newWorkout.title && newWorkout.type && newWorkout.time && newWorkout.goal) {
      const workout: Workout = {
        id: Date.now().toString(),
        title: newWorkout.title!,
        type: newWorkout.type!,
        date: newWorkout.date || selectedDate,
        time: newWorkout.time!,
        duration: newWorkout.duration || 60,
        goal: newWorkout.goal!,
        location: newWorkout.location,
        notes: newWorkout.notes,
        intensity: newWorkout.intensity as "low" | "medium" | "high"
      };
      
      setWorkouts([...workouts, workout]);
      setNewWorkout({ date: selectedDate, intensity: "medium" });
      setIsDialogOpen(false);
    }
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
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
              <Calendar className="w-6 h-6 text-primary" />
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
                <DialogTitle>Schedule New Workout</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
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
                    <Select onValueChange={(value) => setNewWorkout({...newWorkout, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Weight Training">Weight Training</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Swimming">Swimming</SelectItem>
                        <SelectItem value="Cycling">Cycling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newWorkout.time || ""}
                      onChange={(e) => setNewWorkout({...newWorkout, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="60"
                      value={newWorkout.duration || ""}
                      onChange={(e) => setNewWorkout({...newWorkout, duration: parseInt(e.target.value)})}
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
                  <Tabs defaultValue="manual" className="w-full">
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
                      {!googleApiKey ? (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            To search for gyms and fitness centers, you need a Google Maps API key.
                          </p>
                          <ApiKeyInput onApiKeySet={setGoogleApiKey} />
                        </div>
                      ) : (
                        <LocationFinder onLocationSelect={handleLocationSelect} apiKey={googleApiKey} />
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <Button onClick={handleAddWorkout} className="w-full">
                  Schedule Workout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="p-4 lg:col-span-1">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Calendar</h3>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
                modifiers={{
                  hasWorkout: (date) => getWorkoutsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasWorkout: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    fontWeight: "bold"
                  }
                }}
              />
            </div>
          </Card>

          {/* Week View */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-foreground">Week Overview</h3>
            <div className="grid grid-cols-7 gap-2">
              {getWeekDays().map((day, index) => {
                const dayWorkouts = getWorkoutsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                      isSelected && "ring-2 ring-primary",
                      isToday && "bg-primary/5"
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        {format(day, "EEE")}
                      </div>
                      <div className={cn(
                        "text-sm font-medium mb-2",
                        isToday && "text-primary font-bold"
                      )}>
                        {format(day, "dd")}
                      </div>
                      <div className="space-y-1">
                        {dayWorkouts.slice(0, 2).map((workout) => (
                          <div
                            key={workout.id}
                            className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded truncate"
                          >
                            {workout.time} {workout.title}
                          </div>
                        ))}
                        {dayWorkouts.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayWorkouts.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Workouts */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Workouts for {format(selectedDate, "EEEE, MMMM dd")}
          </h3>
          
          {getWorkoutsForDate(selectedDate).length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No workouts scheduled for this day</p>
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
            <div className="space-y-3">
              {getWorkoutsForDate(selectedDate).map((workout) => (
                <Card key={workout.id} className="p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-foreground">{workout.title}</h4>
                        <Badge variant="outline" className={getIntensityColor(workout.intensity)}>
                          {workout.intensity}
                        </Badge>
                        <Badge variant="secondary">{workout.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
                      
                      <div className="flex items-start space-x-2 mb-2">
                        <Target className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Goal:</p>
                          <p className="text-sm text-muted-foreground">{workout.goal}</p>
                        </div>
                      </div>
                      
                      {workout.notes && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          {workout.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button variant="ghost" size="sm">
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
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;