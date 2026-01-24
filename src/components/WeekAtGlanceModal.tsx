import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import DayDetailModal from "./DayDetailModal";

interface WeekAtGlanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WeekAtGlanceModal = ({ open, onOpenChange }: WeekAtGlanceModalProps) => {
  const { getWorkoutsForDate } = useWorkouts();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayDetailOpen, setDayDetailOpen] = useState(false);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setDayDetailOpen(true);
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Week at a Glance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
            {getWeekDays().map((day, index) => {
              const dayWorkouts = getWorkoutsForDate(day);
              const isToday = isSameDay(day, new Date());
              const hasWorkouts = dayWorkouts.length > 0;
              
              return (
                <Card 
                  key={index}
                  className={cn(
                    "p-2 md:p-3 min-h-[100px] md:min-h-[120px] transition-all duration-200 cursor-pointer hover:shadow-md",
                    
                    isToday && "bg-primary/5 border-primary/30",
                    hasWorkouts && "ring-2 ring-blue-500/30 bg-blue-50/50"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="text-center mb-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {format(day, "EEE")}
                    </div>
                    <div className={cn(
                      "text-lg font-semibold",
                      isToday && "text-primary",
                      hasWorkouts && "text-blue-600"
                    )}>
                      {format(day, "dd")}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayWorkouts.length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        No workouts
                      </div>
                    ) : (
                      dayWorkouts.slice(0, 3).map((workout) => (
                        <div
                          key={workout.id}
                          className="text-xs space-y-1"
                        >
                          <div className="font-medium text-foreground truncate">
                            {workout.title}
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{workout.time}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs px-1 py-0", getIntensityColor(workout.intensity))}
                          >
                            {workout.intensity}
                          </Badge>
                        </div>
                      ))
                    )}
                    {dayWorkouts.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayWorkouts.length - 3} more
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-primary/5 p-3 md:p-4 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Week Summary</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {getWeekDays().reduce((total, day) => total + getWorkoutsForDate(day).length, 0)} total workouts scheduled this week
            </div>
          </div>
        </div>
      </DialogContent>

      <DayDetailModal
        open={dayDetailOpen}
        onOpenChange={setDayDetailOpen}
        date={selectedDate}
        workouts={selectedDate ? getWorkoutsForDate(selectedDate) : []}
      />
    </Dialog>
  );
};

export default WeekAtGlanceModal;