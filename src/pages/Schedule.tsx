import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Target, Edit, Trash2, MapPin, Check, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { format, isToday, isTomorrow, isPast, isFuture } from "date-fns";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import FindWorkoutMatch from "@/components/FindWorkoutMatch";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { workouts, updateWorkout, deleteWorkout } = useWorkouts();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [matchWorkout, setMatchWorkout] = useState<{ location?: string; type: string; date: string; time: string } | null>(null);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "bg-green-500/20 text-green-700 border-green-200";
      case "medium": return "bg-yellow-500/20 text-yellow-700 border-yellow-200";
      case "high": return "bg-red-500/20 text-red-700 border-red-200";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  const filteredWorkouts = workouts.filter((workout) => {
    if (filter === "all") return true;
    if (filter === "completed") return workout.completed;
    if (filter === "upcoming") return !workout.completed && isFuture(workout.date);
    if (filter === "today") return isToday(workout.date);
    return true;
  }).sort((a, b) => {
    // Sort by date, then by time
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  const handleMarkComplete = (workoutId: string) => {
    updateWorkout(workoutId, { 
      completed: true, 
      completedAt: new Date() 
    });
    toast({
      title: "Workout Complete! 💪",
      description: "Great job finishing your workout!",
    });
  };

  const handleMarkIncomplete = (workoutId: string) => {
    updateWorkout(workoutId, { 
      completed: false, 
      completedAt: undefined 
    });
  };

  const handleDelete = (workoutId: string) => {
    deleteWorkout(workoutId);
    toast({
      title: "Workout Deleted",
      description: "The workout has been removed from your schedule.",
    });
  };

  // Group workouts by date
  const groupedWorkouts = filteredWorkouts.reduce((groups, workout) => {
    const dateKey = format(workout.date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(workout);
    return groups;
  }, {} as Record<string, typeof workouts>);

  const sortedDateKeys = Object.keys(groupedWorkouts).sort();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 bg-primary/10 rounded-full shrink-0">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Workout Log</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {workouts.length} workout{workouts.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workouts</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Workout List */}
        {workouts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No workouts scheduled yet</p>
              <p className="text-sm mt-1">Use the Schedule button on the Home tab to add workouts</p>
            </div>
          </Card>
        ) : filteredWorkouts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No workouts match this filter</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                Show All Workouts
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedDateKeys.map((dateKey) => (
              <div key={dateKey} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    isToday(new Date(dateKey)) 
                      ? "bg-primary text-primary-foreground" 
                      : isPast(new Date(dateKey)) 
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                  )}>
                    {getDateLabel(new Date(dateKey))}
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Workouts for this date */}
                <div className="space-y-3">
                  {groupedWorkouts[dateKey].map((workout) => (
                    <Card 
                      key={workout.id} 
                      className={cn(
                        "p-4 transition-all duration-200 hover:shadow-md",
                        workout.completed && "bg-green-50/50 border-green-200 dark:bg-green-950/20"
                      )}
                    >
                      <div className="flex flex-col gap-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {workout.completed && (
                              <div className="flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                            <h4 className={cn(
                              "text-base font-semibold",
                              workout.completed ? "text-green-700 dark:text-green-400" : "text-foreground"
                            )}>
                              {workout.title}
                            </h4>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(workout.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className={cn("text-xs", getIntensityColor(workout.intensity))}>
                            {workout.intensity}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">{workout.type}</Badge>
                        </div>
                        
                        {/* Details */}
                        <div className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>{workout.time} • {workout.duration} min</span>
                          </div>
                          
                          {workout.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <span className="break-words">{workout.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Goal */}
                        {workout.goal && (
                          <div className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <p className="text-sm text-muted-foreground">{workout.goal}</p>
                          </div>
                        )}
                        
                        {workout.notes && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
                            <strong>Notes:</strong> {workout.notes}
                          </div>
                        )}

                        {workout.completed && workout.completedAt && (
                          <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                            ✓ Completed at {format(workout.completedAt, "h:mm a")}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-10"
                            onClick={() => setMatchWorkout({
                              location: workout.location,
                              type: workout.type,
                              date: format(workout.date, "MMM d"),
                              time: workout.time,
                            })}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Find Match
                          </Button>
                          {!workout.completed ? (
                            <Button 
                              onClick={() => handleMarkComplete(workout.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm h-10"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Complete
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleMarkIncomplete(workout.id)}
                              variant="outline"
                              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 h-10"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Find Match Dialog */}
      <FindWorkoutMatch
        open={!!matchWorkout}
        onOpenChange={(open) => !open && setMatchWorkout(null)}
        workoutLocation={matchWorkout?.location}
        workoutType={matchWorkout?.type || ""}
        workoutDate={matchWorkout?.date || ""}
        workoutTime={matchWorkout?.time || ""}
      />

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Schedule;
