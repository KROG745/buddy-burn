import { Eye, Target, Calendar, Share2 } from "lucide-react";
import { useState, useCallback } from "react";
import ScheduleWorkoutModal from "./ScheduleWorkoutModal";
import WeekAtGlanceModal from "./WeekAtGlanceModal";
import SetGoalsModal from "./SetGoalsModal";
import ShareWorkoutModal from "./ShareWorkoutModal";
import { useWorkouts } from "@/contexts/WorkoutContext";

const actions = [
  {
    icon: Eye,
    label: "Week at a Glance",
    description: "View your weekly plan",
    color: "bg-primary text-primary-foreground"
  },
  {
    icon: Calendar,
    label: "Schedule",
    description: "Plan your week",
    color: "bg-fitness-accent text-white"
  },
  {
    icon: Share2,
    label: "Share Workout",
    description: "Share with friends",
    color: "bg-[hsl(280_60%_55%)] text-white"
  },
  {
    icon: Target,
    label: "Set Goals",
    description: "Track progress",
    color: "bg-[hsl(38_92%_50%)] text-white"
  },
];

const QuickActions = () => {
  const { workouts } = useWorkouts();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [weekGlanceModalOpen, setWeekGlanceModalOpen] = useState(false);
  const [setGoalsModalOpen, setSetGoalsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const handleActionClick = useCallback((actionLabel: string) => {
    if (actionLabel === "Schedule") {
      setScheduleModalOpen(true);
    } else if (actionLabel === "Week at a Glance") {
      setWeekGlanceModalOpen(true);
    } else if (actionLabel === "Set Goals") {
      setSetGoalsModalOpen(true);
    } else if (actionLabel === "Share Workout") {
      const lastCompleted = workouts.find(w => w.completed);
      if (lastCompleted) {
        setSelectedWorkout(lastCompleted);
        setShareModalOpen(true);
      }
    }
  }, [workouts]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleActionClick(action.label)}
              className={`${action.color} rounded-xl p-4 text-left ios-tap-highlight active:scale-[0.98] transition-transform duration-150`}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-[15px] mb-0.5">{action.label}</div>
              <div className="text-[12px] opacity-80">{action.description}</div>
            </button>
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
    </>
  );
};

export default QuickActions;