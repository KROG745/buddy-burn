import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, UserMinus } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

interface FriendCardProps {
  friend: Profile;
  onRemove: (friendId: string) => Promise<{ success: boolean }>;
}

const FriendCard = ({ friend, onRemove }: FriendCardProps) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to chat with this friend
    navigate(`/chat/${friend.id}`);
  };

  const handleRemove = async () => {
    if (confirm(`Remove ${friend.display_name} from your friends?`)) {
      await onRemove(friend.id);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={friend.avatar_url || undefined} />
            <AvatarFallback>
              {friend.display_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{friend.display_name || 'Unknown User'}</p>
            <p className="text-sm text-muted-foreground">@{friend.username || 'user'}</p>
            {friend.fitness_goal && (
              <p className="text-xs text-muted-foreground mt-1">
                Goal: {friend.fitness_goal}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleMessage}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
          >
            <UserMinus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FriendCard;