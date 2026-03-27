import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { useWorkouts } from "@/contexts/WorkoutContext";

interface Exercise {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function LogWorkoutModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const { addWorkout } = useWorkouts();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([
    { exercise_name: "", sets: 0, reps: 0, weight: 0 }
  ]);

  const handleAddExercise = () => {
    setExercises([...exercises, { exercise_name: "", sets: 0, reps: 0, weight: 0 }]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value as never };
    setExercises(newExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Workout name is required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Insert into Supabase workouts
      const { data: workoutData, error: workoutError } = await (supabase
        .from('workouts' as any)
        .insert({ name, user_id: session.user.id })
        .select()
        .single() as any);

      if (workoutError) throw workoutError;

      // Insert exercises
      const validExercises = exercises.filter(ex => ex.exercise_name.trim() !== "");
      if (validExercises.length > 0) {
        const exercisesToInsert = validExercises.map(ex => ({
          ...ex,
          workout_id: workoutData.id
        }));
        const { error: exerciseError } = await (supabase
          .from('workout_exercises' as any)
          .insert(exercisesToInsert) as any);
          
        if (exerciseError) throw exerciseError;
      }

      // Add to local context for immediate UI feedback
      addWorkout({
        title: name,
        type: 'strength',
        date: new Date(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: '60',
        intensity: 'high',
        completed: true,
        completedAt: new Date()
      });

      toast({
        title: "Workout Logged!",
        description: `Successfully logged ${name}`,
      });
      onOpenChange(false);
      setName("");
      setExercises([{ exercise_name: "", sets: 0, reps: 0, weight: 0 }]);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error logging workout",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto bg-card border-border/50 shadow-elevation">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-fitness-accent to-fitness-primary bg-clip-text text-transparent">
            Log Workout
          </DialogTitle>
          <DialogDescription>
            Record your exercises, sets, reps, and weights to track progress over time.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-semibold">Workout Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Heavy Leg Day, Upper Body Push" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="bg-background/50 border-border/50 focus:border-fitness-accent"
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-foreground font-semibold">Exercises</Label>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 bg-muted/40 rounded-xl border border-border/50 hover:bg-muted/60 transition-colors relative group">
                  <div className="flex justify-between items-center absolute -top-3 right-2">
                    {exercises.length > 1 && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleRemoveExercise(index)} 
                        className="h-6 w-6 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <Input 
                    placeholder="Exercise Name (e.g. Squat)" 
                    value={exercise.exercise_name} 
                    onChange={e => handleChange(index, 'exercise_name', e.target.value)} 
                    className="bg-background/50 text-sm font-medium border-border/50"
                  />
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Sets</Label>
                      <Input 
                        type="number" min="0" 
                        value={exercise.sets || ''} 
                        onChange={e => handleChange(index, 'sets', parseInt(e.target.value) || 0)} 
                        className="h-9 text-center bg-background/50 border-border/50" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Reps</Label>
                      <Input 
                        type="number" min="0" 
                        value={exercise.reps || ''} 
                        onChange={e => handleChange(index, 'reps', parseInt(e.target.value) || 0)} 
                        className="h-9 text-center bg-background/50 border-border/50" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight (lb)</Label>
                      <Input 
                        type="number" min="0" step="0.5"
                        value={exercise.weight || ''} 
                        onChange={e => handleChange(index, 'weight', parseFloat(e.target.value) || 0)} 
                        className="h-9 text-center bg-background/50 border-border/50" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddExercise} 
              className="w-full mt-2 border-dashed border-2 hover:border-fitness-accent hover:text-fitness-accent hover:bg-fitness-accent/10 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Next Exercise
            </Button>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-border/50 items-center">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto mt-2 sm:mt-0">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-fitness-accent to-fitness-primary hover:opacity-90 transition-opacity shadow-glow mt-4 sm:mt-0"
            >
              {isSubmitting ? "Saving..." : "Save Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
