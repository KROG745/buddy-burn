import { Heart, MessageCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityCardProps {
  userName: string;
  userAvatar: string;
  activityType: string;
  duration: string;
  distance: string;
  location: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

const ActivityCard = ({
  userName,
  userAvatar,
  activityType,
  duration,
  distance,
  location,
  timeAgo,
  likes,
  comments,
}: ActivityCardProps) => {
  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-elevation transition-all duration-300 border border-border">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={userAvatar}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{userName}</h3>
          <p className="text-muted-foreground text-sm">{timeAgo}</p>
        </div>
      </div>

      {/* Activity Details */}
      <div className="mb-4">
        <h4 className="text-lg font-bold text-primary mb-2">{activityType}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{location}</p>
      </div>

      {/* Engagement */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </Button>
        </div>
        <Button variant="fitness-outline" size="sm">
          Cheer
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;