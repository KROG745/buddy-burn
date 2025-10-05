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

      // Get or create user stats
      let { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userStats) {
        // Create initial stats
        const { data: newStats, error } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_workouts: 0,
            current_streak: 0,
            longest_streak: 0,
            total_friends: 0,
            total_shares: 0,
            workout_types_completed: [],
          })
          .select()
          .single();

        if (error) throw error;
        userStats = newStats;
      }

      const updatedStats: any = {};

      // Update workout count and streak
      if (updates.workoutCompleted) {
        updatedStats.total_workouts = (userStats.total_workouts || 0) + 1;

        // Calculate streak
        const today = new Date().toISOString().split('T')[0];
        const lastWorkout = userStats.last_workout_date;

        if (!lastWorkout) {
          // First workout
          updatedStats.current_streak = 1;
          updatedStats.longest_streak = 1;
        } else {
          const lastDate = new Date(lastWorkout);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === 0) {
            // Same day, don't update streak
          } else if (daysDiff === 1) {
            // Consecutive day
            updatedStats.current_streak = (userStats.current_streak || 0) + 1;
            updatedStats.longest_streak = Math.max(
              updatedStats.current_streak,
              userStats.longest_streak || 0
            );
          } else {
            // Streak broken
            updatedStats.current_streak = 1;
          }
        }

        updatedStats.last_workout_date = today;
      }

      // Update workout types
      if (updates.workoutType) {
        const types = userStats.workout_types_completed || [];
        const normalizedType = updates.workoutType.toLowerCase().replace(' training', '');
        
        if (!types.includes(normalizedType)) {
          updatedStats.workout_types_completed = [...types, normalizedType];
        }
      }

      // Update friend count
      if (updates.friendAdded) {
        updatedStats.total_friends = (userStats.total_friends || 0) + 1;
      }

      // Update share count
      if (updates.workoutShared) {
        updatedStats.total_shares = (userStats.total_shares || 0) + 1;
      }

      // Save updates
      if (Object.keys(updatedStats).length > 0) {
        const { error } = await supabase
          .from('user_stats')
          .update(updatedStats)
          .eq('user_id', user.id);

        if (error) throw error;
      }

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
        
        // Show toast for first achievement
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
