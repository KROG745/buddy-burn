import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
}

export const useAchievementSystem = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const { toast } = useToast();

  const updateUserStats = useCallback(async (updates: {
    workoutCompleted?: boolean;
    workoutType?: string;
    friendAdded?: boolean;
    workoutShared?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call edge function to update stats server-side
      const { error } = await supabase.functions.invoke('update-user-stats', {
        body: updates,
      });

      if (error) throw error;

      // Check for new achievements
      await checkAchievements();
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }, []);

  const checkAchievements = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-achievements');

      if (error) throw error;

      if (data?.newAchievements && data.newAchievements.length > 0) {
        setNewAchievements(data.newAchievements);
        
        const first = data.newAchievements[0];
        toast({
          title: `🎉 ${first.title}`,
          description: first.description,
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, toast]);

  const clearAchievementNotification = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  return {
    updateUserStats,
    checkAchievements,
    newAchievements,
    clearAchievementNotification,
    isChecking,
  };
};
