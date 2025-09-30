import { useState } from "react";
import { Share2, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { useFriends } from "@/hooks/useFriends";
import { useProfile } from "@/hooks/useProfile";

interface ShareWorkoutModalProps {
  workoutId: string;
  workoutTitle: string;
}

const ShareWorkoutModal = ({ workoutId, workoutTitle }: ShareWorkoutModalProps) => {
  const { user } = useProfile();
  const { shareWorkout } = useWorkoutShares(user?.id);
  const { friends } = useFriends(user?.id);
  const [open, setOpen] = useState(false);
  const [shareType, setShareType] = useState<"public" | "friend">("public");
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    const result = await shareWorkout(
      workoutId,
      shareType === "public",
      shareType === "friend" ? selectedFriend : null,
      caption || null
    );
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      setCaption("");
      setShareType("public");
      setSelectedFriend("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Workout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Workout: {workoutTitle}</p>
          </div>

          <div>
            <Label>Share With</Label>
            <RadioGroup value={shareType} onValueChange={(v) => setShareType(v as "public" | "friend")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="w-4 h-4" />
                  Everyone (Public)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friend" id="friend" />
                <Label htmlFor="friend" className="flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" />
                  Specific Friend
                </Label>
              </div>
            </RadioGroup>
          </div>

          {shareType === "friend" && (
            <div>
              <Label>Select Friend</Label>
              <Select value={selectedFriend} onValueChange={setSelectedFriend}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a friend" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.display_name || friend.username || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Caption (Optional)</Label>
            <Textarea
              placeholder="Add a caption to your workout share..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleShare}
            disabled={loading || (shareType === "friend" && !selectedFriend)}
            className="w-full"
          >
            {loading ? "Sharing..." : "Share Workout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareWorkoutModal;
