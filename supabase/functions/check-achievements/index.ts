import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    console.log('Checking achievements for user:', user.id);

    // Get user stats
    const { data: userStats } = await supabaseClient
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!userStats) {
      console.log('No user stats found');
      return new Response(
        JSON.stringify({ newAchievements: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User stats:', userStats);

    // Get all achievement definitions
    const { data: achievements } = await supabaseClient
      .from('achievement_definitions')
      .select('*');

    // Get user's current achievement progress
    const { data: progress } = await supabaseClient
      .from('user_achievement_progress')
      .select('*')
      .eq('user_id', user.id);

    const completedAchievements = new Set(
      progress?.filter(p => p.is_completed).map(p => p.achievement_id) || []
    );

    const newAchievements = [];

    // Check each achievement
    for (const achievement of achievements || []) {
      // Skip if already completed
      if (completedAchievements.has(achievement.id)) {
        continue;
      }

      let isEarned = false;
      let currentProgress = 0;

      // Check based on requirement type
      switch (achievement.requirement_type) {
        case 'workout_count':
          currentProgress = userStats.total_workouts;
          isEarned = userStats.total_workouts >= achievement.requirement_value;
          break;
        
        case 'streak_days':
          currentProgress = userStats.current_streak;
          isEarned = userStats.current_streak >= achievement.requirement_value;
          break;
        
        case 'friend_count':
          currentProgress = userStats.total_friends;
          isEarned = userStats.total_friends >= achievement.requirement_value;
          break;
        
        case 'share_count':
          currentProgress = userStats.total_shares;
          isEarned = userStats.total_shares >= achievement.requirement_value;
          break;
        
        case 'workout_types':
          currentProgress = userStats.workout_types_completed?.length || 0;
          if (achievement.id === 'all_workout_types') {
            isEarned = currentProgress >= 6; // All types
          } else {
            // Individual workout type achievements
            const workoutType = achievement.id.replace('try_', '');
            isEarned = userStats.workout_types_completed?.includes(workoutType) || false;
          }
          break;
      }

      // Update or insert progress
      const { error: progressError } = await supabaseClient
        .from('user_achievement_progress')
        .upsert({
          user_id: user.id,
          achievement_id: achievement.id,
          current_progress: currentProgress,
          is_completed: isEarned,
          completed_at: isEarned ? new Date().toISOString() : null,
        });

      if (progressError) {
        console.error('Error updating progress:', progressError);
      }

      // If newly earned, add to achievements table and return it
      if (isEarned) {
        console.log('New achievement earned:', achievement.title);
        
        const { error: achievementError } = await supabaseClient
          .from('achievements')
          .insert({
            user_id: user.id,
            type: achievement.category,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
          });

        if (achievementError) {
          console.error('Error inserting achievement:', achievementError);
        }

        // Update user points and level
        const newPoints = userStats.total_points + achievement.points;
        const newLevel = Math.floor(newPoints / 100) + 1;

        await supabaseClient
          .from('user_stats')
          .update({
            total_points: newPoints,
            level: newLevel,
          })
          .eq('user_id', user.id);

        newAchievements.push(achievement);
      }
    }

    console.log('New achievements:', newAchievements.length);

    return new Response(
      JSON.stringify({ newAchievements }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking achievements:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
