import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkoutShare {
  id: string;
  user_id: string;
  workout_id: string;
  shared_with_id: string | null;
  is_public: boolean;
  caption: string | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useWorkoutShares = (userId: string | undefined) => {
  const [shares, setShares] = useState<WorkoutShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setShares([]);
      setLoading(false);
      return;
    }

    fetchShares();
  }, [userId]);

  const fetchShares = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_shares')
        .select('*, profiles!workout_shares_user_id_fkey(display_name, username, avatar_url)')
        .or(`is_public.eq.true,shared_with_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setShares(data || []);
    } catch (error) {
      console.error('Error fetching workout shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareWorkout = async (
    workoutId: string,
    isPublic: boolean,
    sharedWithId: string | null,
    caption: string | null
  ) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('workout_shares')
        .insert({
          user_id: userId,
          workout_id: workoutId,
          is_public: isPublic,
          shared_with_id: sharedWithId,
          caption: caption,
        });

      if (error) throw error;

      toast.success('Workout shared successfully!');
      fetchShares();
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to share workout');
      console.error('Error sharing workout:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteShare = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('workout_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;

      toast.success('Share removed');
      fetchShares();
      return { success: true };
    } catch (error) {
      toast.error('Failed to remove share');
      console.error('Error deleting share:', error);
      return { success: false };
    }
  };

  return {
    shares,
    loading,
    shareWorkout,
    deleteShare,
    refetch: fetchShares,
  };
};
