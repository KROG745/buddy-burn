import { Eye, Users, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ScheduleWorkoutModal from "./ScheduleWorkoutModal";
import WeekAtGlanceModal from "./WeekAtGlanceModal";
import SetGoalsModal from "./SetGoalsModal";

const QuickActions = () => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [weekGlanceModalOpen, setWeekGlanceModalOpen] = useState(false);
  const [setGoalsModalOpen, setSetGoalsModalOpen] = useState(false);

  const handleActionClick = (actionLabel: string) => {
    if (actionLabel === "Schedule") {
      setScheduleModalOpen(true);
    } else if (actionLabel === "Week at a Glance") {
      setWeekGlanceModalOpen(true);
    } else if (actionLabel === "Set Goals") {
      setSetGoalsModalOpen(true);
    }
    // Add other action handlers here
  };

  const actions = [
    {
      icon: Eye,
      label: "Week at a Glance",
      variant: "fitness" as const,
      description: "View your weekly plan"
    },
    {
      icon: Calendar,
      label: "Schedule",
      variant: "fitness-outline" as const,
      description: "Plan your week"
    },
    {
      icon: Users,
      label: "Find Friends",
      variant: "fitness-outline" as const,
      description: "Connect with others"
    },
    {
      icon: Target,
      label: "Set Goals",
      variant: "fitness-outline" as const,
      description: "Track progress"
    },
  ];

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
    </>
  );
};

export default QuickActions;