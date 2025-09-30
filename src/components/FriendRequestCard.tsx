import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { FriendRequest } from "@/hooks/useFriends";
import { toast } from "sonner";

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: string) => Promise<{ success: boolean }>;
  onReject: (requestId: string) => Promise<{ success: boolean }>;
}

const FriendRequestCard = ({ request, onAccept, onReject }: FriendRequestCardProps) => {
  const sender = request.sender;

  const handleAccept = async () => {
    const result = await onAccept(request.id);
    if (result.success) {
      toast.success(`You're now friends with ${sender?.display_name || 'this user'}!`);
    } else {
      toast.error('Failed to accept friend request');
    }
  };

  const handleReject = async () => {
    const result = await onReject(request.id);
    if (result.success) {
      toast.success('Friend request rejected');
    } else {
      toast.error('Failed to reject friend request');
    }
  };

  if (!sender) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={sender.avatar_url || undefined} />
            <AvatarFallback>
              {sender.display_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{sender.display_name || 'Unknown User'}</p>
            <p className="text-sm text-muted-foreground">@{sender.username || 'user'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={handleAccept}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FriendRequestCard;