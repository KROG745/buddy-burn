import { useState, useCallback } from "react";
import { Target, Plus, Calendar, TrendingUp, Award, Save, CalendarIcon } from "lucide-react";

// Helper to dismiss keyboard on iOS when tapping other elements
const dismissKeyboard = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_fitness';
  target: string;
  timeframe: string;
  targetDate?: Date;
  description: string;
  progress: number;
  isActive: boolean;
}

interface SetGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetGoalsModal = ({ isOpen, onClose }: SetGoalsModalProps) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Lose 10 pounds',
      type: 'weight_loss',
      target: '10 lbs',
      timeframe: '3 months',
      description: 'Reduce weight through consistent cardio and strength training',
      progress: 30,
      isActive: true
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'general_fitness' as Goal['type'],
    target: '',
    timeframe: '',
    targetDate: undefined as Date | undefined,
    description: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss', icon: TrendingUp },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: Award },
    { value: 'endurance', label: 'Endurance', icon: Target },
    { value: 'strength', label: 'Strength', icon: Award },
    { value: 'flexibility', label: 'Flexibility', icon: Target },
    { value: 'general_fitness', label: 'General Fitness', icon: TrendingUp }
  ];

  const timeframes = [
    '1 month', '2 months', '3 months', '6 months', '1 year', 'Ongoing'
  ];

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.timeframe) {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        progress: 0,
        isActive: true
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        type: 'general_fitness',
        target: '',
        timeframe: '',
        targetDate: undefined,
        description: ''
      });
      setShowAddForm(false);
      
      toast({
        title: "Goal Added",
        description: "Your fitness goal has been successfully added!",
      });
    }
  };

  const getGoalTypeInfo = (type: Goal['type']) => {
    return goalTypes.find(t => t.value === type) || goalTypes[0];
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Set Fitness Goals</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Goals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Goals</h3>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            {goals.length === 0 ? (
              <Card className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No goals set yet. Add your first fitness goal!</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {goals.map((goal) => {
                  const typeInfo = getGoalTypeInfo(goal.type);
                  const TypeIcon = typeInfo.icon;
                  
                  return (
                    <Card key={goal.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <TypeIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{goal.title}</h4>
                            <Badge variant="secondary" className="mt-1">
                              {typeInfo.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{goal.timeframe}</span>
                          </div>
                          {goal.targetDate && (
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>Due: {format(goal.targetDate, "MMM dd, yyyy")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target: {goal.target}</span>
                          <span className="font-medium">{goal.progress}% Complete</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>

                        {goal.description && (
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New Goal Form */}
          {showAddForm && (
            <Card className="p-6 border-primary/20">
              <h4 className="text-lg font-semibold mb-4">Add New Goal</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      placeholder="e.g., Run a 5K"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <Select 
                      value={newGoal.type} 
                      onValueChange={(value: Goal['type']) => {
                        dismissKeyboard();
                        setNewGoal({...newGoal, type: value});
                      }}
                    >
                      <SelectTrigger onTouchStart={dismissKeyboard}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goalTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-target">Target</Label>
                    <Input
                      id="goal-target"
                      placeholder="e.g., 10 lbs, 30 minutes, etc."
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-timeframe">Timeframe</Label>
                    <Select 
                      value={newGoal.timeframe} 
                      onValueChange={(value) => {
                        dismissKeyboard();
                        setNewGoal({...newGoal, timeframe: value});
                      }}
                    >
                      <SelectTrigger onTouchStart={dismissKeyboard}>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Target Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        onTouchStart={dismissKeyboard}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newGoal.targetDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newGoal.targetDate ? format(newGoal.targetDate, "PPP") : <span>Pick a target date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newGoal.targetDate}
                        onSelect={(date) => {
                          dismissKeyboard();
                          setNewGoal({...newGoal, targetDate: date});
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="goal-description">Description (Optional)</Label>
                  <Textarea
                    id="goal-description"
                    placeholder="Describe your goal and strategy..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button onClick={() => {
                    dismissKeyboard();
                    handleAddGoal();
                  }} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Goal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      dismissKeyboard();
                      setShowAddForm(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetGoalsModal;