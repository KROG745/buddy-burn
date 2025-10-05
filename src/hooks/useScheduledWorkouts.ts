import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScheduleWorkoutParams {
  workout_type: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  notes?: string;
  intensity?: string;
}

export const useScheduledWorkouts = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const scheduleWorkout = useCallback(async (params: ScheduleWorkoutParams) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to schedule workouts');
      }

      // Normalize location for better matching
      const normalizedLocation = params.location.toLowerCase().trim();

      const { data, error } = await supabase
        .from('scheduled_workouts')
        .insert({
          user_id: user.id,
          workout_type: params.workout_type,
          date: params.date.toISOString().split('T')[0],
          time: params.time,
          duration: params.duration,
          location: params.location,
          location_normalized: normalizedLocation,
          notes: params.notes,
          intensity: params.intensity || 'medium',
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-share workout based on user's privacy settings
      const workoutId = data.id;
      
      // Get user's profile to check privacy settings
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_public')
        .eq('id', user.id)
        .single();

      if (profile?.is_public) {
        // If user is public, share to public feed
        await supabase
          .from('workout_shares')
          .insert({
            user_id: user.id,
            workout_id: workoutId,
            is_public: true,
            caption: `Scheduled ${params.workout_type} workout at ${params.location}`,
          });
      } else {
        // If user is private, share to friends only
        const { data: friends } = await supabase
          .from('friends')
          .select('friend_id')
          .eq('user_id', user.id);

        if (friends && friends.length > 0) {
          const friendShares = friends.map(friend => ({
            user_id: user.id,
            workout_id: workoutId,
            is_public: false,
            shared_with_id: friend.friend_id,
            caption: `Scheduled ${params.workout_type} workout at ${params.location}`,
          }));

          await supabase
            .from('workout_shares')
            .insert(friendShares);
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error scheduling workout:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule workout",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    scheduleWorkout,
    loading,
  };
};
