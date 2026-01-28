import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { useToast } from "@/hooks/use-toast";
import { Workout } from "@/contexts/WorkoutContext";
import { Share2 } from "lucide-react";

// Helper to dismiss keyboard on iOS when tapping other elements
const dismissKeyboard = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

interface ShareWorkoutModalProps {
  workout: Workout | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareWorkoutModal = ({ workout, open, onOpenChange }: ShareWorkoutModalProps) => {
  const [caption, setCaption] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const { shareWorkout } = useWorkoutShares();
  const { toast } = useToast();

  const handleShare = () => {
    if (!workout) return;

    shareWorkout({
      workout_id: workout.id,
      caption: caption || undefined,
      is_public: isPublic,
    });

    toast({
      title: "Workout Shared!",
      description: isPublic 
        ? "Your workout has been shared publicly." 
        : "Your workout has been shared with friends.",
    });

    setCaption("");
    onOpenChange(false);
  };

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Workout
          </DialogTitle>
          <DialogDescription>
            Share your "{workout.title}" workout with the community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption to your workout..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          <div 
            className="flex items-center justify-between"
            onTouchStart={dismissKeyboard}
            onClick={dismissKeyboard}
          >
            <div className="space-y-0.5">
              <Label htmlFor="public">Share Publicly</Label>
              <p className="text-sm text-muted-foreground">
                Make this visible to everyone
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={(checked) => {
                dismissKeyboard();
                setIsPublic(checked);
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              dismissKeyboard();
              onOpenChange(false);
            }} 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              dismissKeyboard();
              handleShare();
            }} 
            className="flex-1"
          >
            Share Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareWorkoutModal;
