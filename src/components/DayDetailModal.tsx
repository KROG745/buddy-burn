import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, Type } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Workout {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  intensity: string;
  type: string;
  location?: string;
  notes?: string;
}

interface DayDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  workouts: Workout[];
}

const DayDetailModal = ({ open, onOpenChange, date, workouts }: DayDetailModalProps) => {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "bg-green-500/20 text-green-700 border-green-200";
      case "medium": return "bg-yellow-500/20 text-yellow-700 border-yellow-200";
      case "high": return "bg-red-500/20 text-red-700 border-red-200";
      default: return "bg-gray-500/20 text-gray-700 border-gray-200";
    }
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {format(date, "EEEE, MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No workouts scheduled for this day</p>
            </div>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-foreground">
                      {workout.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getIntensityColor(workout.intensity))}
                      >
                        {workout.intensity}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {workout.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{workout.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Type className="w-4 h-4" />
                    <span>{workout.duration}</span>
                  </div>
                </div>

                {workout.location && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{workout.location}</span>
                  </div>
                )}

                {workout.notes && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {workout.notes}
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailModal;
