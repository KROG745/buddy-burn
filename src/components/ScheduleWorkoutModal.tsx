import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Dumbbell, MapPin, Users, Search, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useWorkouts } from "@/contexts/WorkoutContext";
import LocationFinder from "./LocationFinder";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your workout.",
  }),
  time: z.string({
    required_error: "Please select a time for your workout.",
  }),
  workoutType: z.string({
    required_error: "Please select a workout type.",
  }),
  duration: z.string({
    required_error: "Please specify the duration.",
  }),
  location: z.string().optional(),
  notes: z.string().optional(),
  publishToFeed: z.boolean().default(false),
  shareCaption: z.string().optional(),
});

interface ScheduleWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const workoutTypes = [
  { value: "running", label: "Running", icon: "🏃‍♂️" },
  { value: "strength", label: "Strength Training", icon: "💪" },
  { value: "yoga", label: "Yoga", icon: "🧘‍♀️" },
  { value: "cycling", label: "Cycling", icon: "🚴‍♂️" },
  { value: "swimming", label: "Swimming", icon: "🏊‍♂️" },
  { value: "hiit", label: "HIIT", icon: "🔥" },
  { value: "pilates", label: "Pilates", icon: "🤸‍♀️" },
  { value: "boxing", label: "Boxing", icon: "🥊" },
];

const timeSlots = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
];

const durations = [
  "15 min", "30 min", "45 min", "60 min", "90 min", "120 min"
];

const ScheduleWorkoutModal = ({ open, onOpenChange }: ScheduleWorkoutModalProps) => {
  const { toast } = useToast();
  const { addWorkout } = useWorkouts();
  const { shareWorkout } = useWorkoutShares();
  const [isLoading, setIsLoading] = useState(false);
  const [locationTab, setLocationTab] = useState("manual");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publishToFeed: false,
      shareCaption: "",
    },
  });

  const publishToFeed = form.watch("publishToFeed");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Convert duration from "X min" format to just the number
      const durationNumber = values.duration.replace(' min', '');
      
      // Generate workout ID
      const workoutId = Date.now().toString();
      
      // Add workout to context
      addWorkout({
        title: `${values.workoutType.charAt(0).toUpperCase() + values.workoutType.slice(1)} Workout`,
        type: values.workoutType,
        date: values.date,
        time: values.time,
        duration: durationNumber,
        goal: `${values.workoutType} session`,
        location: values.location,
        notes: values.notes,
        intensity: 'medium'
      });
      
      // If publishing to feed, share the workout
      if (values.publishToFeed) {
        shareWorkout({
          workout_id: workoutId,
          caption: values.shareCaption || `Scheduled ${values.workoutType} workout for ${format(values.date, "PPP")} at ${values.time}`,
          is_public: true,
        });
      }
      
      toast({
        title: "Workout Scheduled! 🎉",
        description: values.publishToFeed 
          ? `${values.workoutType} scheduled and shared to your feed!`
          : `${values.workoutType} scheduled for ${format(values.date, "PPP")} at ${values.time}`,
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Dumbbell className="w-5 h-5" />
            Schedule Workout
          </DialogTitle>
          <DialogDescription>
            Plan your next workout session and invite friends to join you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <Clock className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50 bg-popover">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50 bg-popover">
                        {durations.map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Workout Type */}
            <FormField
              control={form.control}
              name="workoutType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <Dumbbell className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 bg-popover">
                      {workoutTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location with Tabs */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Tabs value={locationTab} onValueChange={setLocationTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual">Manual Input</TabsTrigger>
                        <TabsTrigger value="finder">Find Gyms</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="manual" className="mt-4">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="e.g., Central Park, Home Gym, Fitness Plus"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="finder" className="mt-4">
                        {locationTab === "finder" && (
                          <LocationFinder
                            onLocationSelect={(location) => {
                              field.onChange(location);
                            }}
                          />
                        )}
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about your workout..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Publish to Feed Section */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
              <FormField
                control={form.control}
                name="publishToFeed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Publish to Feed
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Share this workout with your friends
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {publishToFeed && (
                <FormField
                  control={form.control}
                  name="shareCaption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a caption for your workout post..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="fitness"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-4 h-4" />
                    Schedule Workout
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleWorkoutModal;