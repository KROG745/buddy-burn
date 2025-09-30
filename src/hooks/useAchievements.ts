import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

export const useAchievements = (userId: string | undefined) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    fetchAchievements();
  }, [userId]);

  const fetchAchievements = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    achievements,
    loading,
    refetch: fetchAchievements
  };
};
