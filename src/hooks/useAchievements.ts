import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  icon: string;
  earned_at: string;
}

export const useAchievements = () => {
  const queryClient = useQueryClient();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    },
  });

  const addAchievement = useMutation({
    mutationFn: async (achievement: Omit<Achievement, 'id' | 'earned_at'>) => {
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievement])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  return {
    achievements: achievements || [],
    isLoading,
    addAchievement: addAchievement.mutate,
  };
};
