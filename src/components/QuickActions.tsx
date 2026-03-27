import { Eye, Users, Target, Calendar, Share2, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useMemo } from "react";
import ScheduleWorkoutModal from "./ScheduleWorkoutModal";
import WeekAtGlanceModal from "./WeekAtGlanceModal";
import SetGoalsModal from "./SetGoalsModal";
import ShareWorkoutModal from "./ShareWorkoutModal";
import LogWorkoutModal from "./LogWorkoutModal";
import { useWorkouts } from "@/contexts/WorkoutContext";

const actions = [
  {
    icon: Dumbbell,
    label: "Log Workout",
    variant: "fitness" as const,
    description: "Record your lifts"
  },
  {
    icon: Eye,
    label: "Week at a Glance",
    variant: "fitness-outline" as const,
    description: "View your weekly plan"
  },
  {
    icon: Calendar,
    label: "Schedule",
    variant: "fitness-outline" as const,
    description: "Plan your week"
  },
  {
    icon: Share2,
    label: "Share",
    variant: "fitness-outline" as const,
    description: "Share with friends"
  },
];

const QuickActions = () => {
  const { workouts } = useWorkouts();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [weekGlanceModalOpen, setWeekGlanceModalOpen] = useState(false);
  const [setGoalsModalOpen, setSetGoalsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const handleActionClick = useCallback((actionLabel: string) => {
    if (actionLabel === "Log Workout") {
      setLogModalOpen(true);
    } else if (actionLabel === "Schedule") {
      setScheduleModalOpen(true);
    } else if (actionLabel === "Week at a Glance") {
      setWeekGlanceModalOpen(true);
    } else if (actionLabel === "Set Goals") {
      setSetGoalsModalOpen(true);
    } else if (actionLabel === "Share") {
      // Get the last completed workout
      const lastCompleted = workouts.find(w => w.completed);
      if (lastCompleted) {
        setSelectedWorkout(lastCompleted);
        setShareModalOpen(true);
      }
    }
  }, [workouts]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant}
              className="h-20 flex-col gap-2 text-center"
              onClick={() => handleActionClick(action.label)}
            >
              <Icon className="w-6 h-6" />
              <div>
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      <ScheduleWorkoutModal 
        open={scheduleModalOpen} 
        onOpenChange={setScheduleModalOpen} 
      />
      
      <WeekAtGlanceModal 
        open={weekGlanceModalOpen} 
        onOpenChange={setWeekGlanceModalOpen} 
      />
      
      <SetGoalsModal 
        isOpen={setGoalsModalOpen} 
        onClose={() => setSetGoalsModalOpen(false)} 
      />
      
      <ShareWorkoutModal
        workout={selectedWorkout}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
      
      <LogWorkoutModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
      />
    </>
  );
};

export default QuickActions;