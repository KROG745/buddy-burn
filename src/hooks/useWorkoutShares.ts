import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorkoutShare {
  id: string;
  user_id: string;
  workout_id: string;
  caption?: string;
  is_public: boolean;
  shared_with_id?: string;
  created_at: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
    username?: string;
    hide_location_from_friends?: boolean;
  };
}

export const useWorkoutShares = () => {
  const queryClient = useQueryClient();

  const { data: shares, isLoading } = useQuery({
    queryKey: ['workout-shares'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_shares')
        .select(`
          id,
          user_id,
          workout_id,
          caption,
          is_public,
          shared_with_id,
          created_at,
          profiles!workout_shares_user_id_fkey (
            display_name,
            avatar_url,
            username,
            hide_location_from_friends
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as WorkoutShare[];
    },
  });

  const shareWorkout = useMutation({
    mutationFn: async (share: {
      workout_id: string;
      caption?: string;
      is_public: boolean;
      shared_with_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('workout_shares')
        .insert([{ ...share, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-shares'] });
    },
  });

  const deleteShare = useMutation({
    mutationFn: async (shareId: string) => {
      const { error } = await supabase
        .from('workout_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-shares'] });
    },
  });

  return {
    shares: shares || [],
    isLoading,
    shareWorkout: shareWorkout.mutate,
    deleteShare: deleteShare.mutate,
  };
};
