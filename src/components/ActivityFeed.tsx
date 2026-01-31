import { useState } from "react";
import { Clock, MapPin, Calendar, MessageCircle, UserPlus, ChevronDown, ChevronUp, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkoutShares } from "@/hooks/useWorkoutShares";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/contexts/ConversationContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ActivityFeed = () => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [editingShare, setEditingShare] = useState<{ id: string; caption: string } | null>(null);
  const [deleteShareId, setDeleteShareId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  
  const toggleExpanded = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const { shares, isLoading, deleteShare } = useWorkoutShares();
  const navigate = useNavigate();
  const { addConversation } = useConversations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mutation for updating caption
  const updateCaption = useMutation({
    mutationFn: async ({ shareId, caption }: { shareId: string; caption: string }) => {
      const { error } = await supabase
        .from('workout_shares')
        .update({ caption })
        .eq('id', shareId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-shares'] });
      toast({
        title: "Updated",
        description: "Your shared workout has been updated.",
      });
      setEditingShare(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the shared workout.",
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteShare = (shareId: string) => {
    deleteShare(shareId);
    setDeleteShareId(null);
    toast({
      title: "Deleted",
      description: "Your shared workout has been removed from the feed.",
    });
  };
  
  const handleEditClick = (shareId: string, currentCaption: string) => {
    setEditingShare({ id: shareId, caption: currentCaption });
    setEditCaption(currentCaption || "");
  };
  
  const handleSaveEdit = () => {
    if (editingShare) {
      updateCaption.mutate({ shareId: editingShare.id, caption: editCaption });
    }
  };
  
  // Fetch scheduled workout details for each share
  const { data: workoutDetails } = useQuery({
    queryKey: ['workout-details', shares],
    queryFn: async () => {
      if (!shares || shares.length === 0) return [];
      
      const workoutIds = shares.map(share => share.workout_id);
      const { data } = await supabase
        .from('scheduled_workouts')
        .select('*')
        .in('id', workoutIds);
      
      return data || [];
    },
    enabled: shares.length > 0,
  });
  
  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });
  
  // Demo data for showcase
  const demoActivities = [
    {
      id: 'demo-1',
      userId: 'demo-user-1',
      user: {
        display_name: 'Sarah Runner',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        username: 'sarah_runner'
      },
      caption: 'Who wants to join me for a morning run? Perfect weather tomorrow! 🌤️',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      workout: {
        id: 'demo-workout-1',
        workout_type: 'Cardio',
        date: '2025-10-06',
        time: '7:00 AM',
        duration: '45',
        location: 'Central Park - Main Loop',
        intensity: 'medium',
        notes: 'Morning run, all levels welcome!'
      }
    },
    {
      id: 'demo-2',
      userId: 'demo-user-2',
      user: {
        display_name: 'Mike Strong',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        username: 'mike_strong'
      },
      caption: 'Chest and triceps at Gold\'s tonight! Looking for a workout partner 💪',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      workout: {
        id: 'demo-workout-2',
        workout_type: 'Weight Training',
        date: '2025-10-06',
        time: '6:00 PM',
        duration: '60',
        location: 'Gold\'s Gym Downtown',
        intensity: 'high',
        notes: 'Chest and triceps day - spotters needed'
      }
    },
    {
      id: 'demo-3',
      userId: 'demo-user-3',
      user: {
        display_name: 'Emma Yoga',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        username: 'emma_yoga'
      },
      caption: 'Sunrise yoga on the beach tomorrow! All levels welcome 🧘‍♀️',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      workout: {
        id: 'demo-workout-3',
        workout_type: 'Yoga',
        date: '2025-10-07',
        time: '8:00 AM',
        duration: '60',
        location: 'Sunset Beach',
        intensity: 'low',
        notes: 'Beach yoga session - bring your mat!'
      }
    }
  ];
  
  // Combine real shares with demo data
  const realActivities = shares.map(share => {
    const workout = workoutDetails?.find(w => w.id === share.workout_id);
    const hideLocation = share.profiles?.hide_location_from_friends || false;
    return {
      id: share.id,
      userId: share.user_id,
      user: share.profiles,
      caption: share.caption,
      createdAt: share.created_at,
      workout: workout ? {
        ...workout,
        location: hideLocation ? 'Location hidden' : workout.location,
      } : undefined,
      hideLocation,
    };
  }).filter(activity => activity.workout);
  
  const recentActivities = [...realActivities, ...demoActivities];
  
  const handleStartConversation = (activity: any) => {
    if (!activity.user || !activity.workout) return;
    
    const workoutInfo = activity.workout;
    const message = `Hi! I saw your ${workoutInfo.workout_type} workout scheduled at ${workoutInfo.location} on ${workoutInfo.date} at ${workoutInfo.time}. Would it be okay if I joined you?`;
    
    // Add or update conversation
    addConversation({
      id: activity.userId,
      name: activity.user.display_name || 'User',
      avatar: activity.user.avatar_url || '',
      lastMessage: message,
      timestamp: 'Just now',
      unreadCount: 0,
      isOnline: true,
    });
    
    // Navigate to chat with pre-filled message
    navigate(`/chat/${activity.userId}?iceBreaker=${encodeURIComponent(message)}`);
    
    toast({
      title: "Starting conversation",
      description: `Opening chat with ${activity.user.display_name}`,
    });
  };

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return 'bg-fitness-warning/10 text-fitness-warning';
      case 'strength':
      case 'weight training':
        return 'bg-fitness-success/10 text-fitness-success';
      case 'flexibility':
      case 'yoga':
        return 'bg-fitness-accent/10 text-fitness-accent';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-fitness-warning/10 text-fitness-warning';
      case 'low':
        return 'bg-fitness-success/10 text-fitness-success';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Loading activities...</p>
      </Card>
    );
  }

  if (recentActivities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No recent activities to show.</p>
        <p className="text-sm text-muted-foreground mt-1">Schedule workouts to see them here!</p>
      </Card>
    );
  }

  return (
    <>
    <div className="space-y-4 overflow-hidden">
      {recentActivities.map((activity) => {
        const workout = activity.workout;
        if (!workout) return null;
        
        const isOwner = currentUser && activity.userId === currentUser.id && !activity.id.startsWith('demo-');
        
        return (
          <Card key={activity.id} className="p-4 hover:shadow-elevation transition-all duration-300 overflow-hidden">
            <div className="flex items-start gap-3 w-full">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={activity.user?.avatar_url || ""} alt={activity.user?.display_name || "User"} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {activity.user?.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="font-semibold text-foreground truncate">
                      {activity.user?.display_name || 'User'}
                    </span>
                    <Badge variant="secondary" className={`${getActivityTypeColor(workout.workout_type)} shrink-0`}>
                      {workout.workout_type}
                    </Badge>
                    <Badge variant="outline" className={`${getIntensityColor(workout.intensity || 'medium')} shrink-0`}>
                      {workout.intensity || 'medium'}
                    </Badge>
                  </div>
                  
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(activity.id, activity.caption || "")}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit caption
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteShareId(activity.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove from feed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {activity.caption && (
                  <p className={`text-sm text-foreground mb-2 break-words ${expandedCards.has(activity.id) ? '' : 'line-clamp-2'}`}>
                    {activity.caption}
                  </p>
                )}
                
                <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="break-words">{workout.time} • {workout.duration} min</span>
                  </div>
                  {workout.location && (
                    <div className="flex items-start gap-1">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="break-words">{workout.location}</span>
                    </div>
                  )}
                </div>
                
                {workout.notes && (
                  <p className={`text-sm text-muted-foreground mb-2 italic break-words ${expandedCards.has(activity.id) ? '' : 'line-clamp-2'}`}>
                    "{workout.notes}"
                  </p>
                )}
                
                {/* Show more/less button when content might be truncated */}
                {((activity.caption && activity.caption.length > 100) || (workout.notes && workout.notes.length > 80)) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-primary -ml-2 mb-1"
                    onClick={() => toggleExpanded(activity.id)}
                  >
                    {expandedCards.has(activity.id) ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-1" />
                        Show more
                      </>
                    )}
                  </Button>
                )}
                
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {/* Show join button only if it's not the current user's workout */}
                  {currentUser && activity.userId !== currentUser.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 hover:bg-primary/10 hover:text-primary shrink-0"
                      onClick={() => handleStartConversation(activity)}
                    >
                      <UserPlus className="w-3 h-3" />
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-xs">Request to Join</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
    
    {/* Edit Caption Dialog */}
    <Dialog open={!!editingShare} onOpenChange={() => setEditingShare(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Caption</DialogTitle>
        </DialogHeader>
        <Textarea
          value={editCaption}
          onChange={(e) => setEditCaption(e.target.value)}
          placeholder="Update your caption..."
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingShare(null)}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} disabled={updateCaption.isPending}>
            {updateCaption.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    {/* Delete Confirmation Dialog */}
    <AlertDialog open={!!deleteShareId} onOpenChange={() => setDeleteShareId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from feed?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove your workout from the activity feed. The scheduled workout itself will not be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteShareId && handleDeleteShare(deleteShareId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};

export default ActivityFeed;