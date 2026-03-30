import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Allowed origins for CORS
const allowedOrigins = [
  'https://buddy-burn.lovable.app',
  'https://fitnessfriends.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin!,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Client for user authentication validation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Admin client for privileged operations (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user - validates authentication
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    console.log('Checking achievements for user:', user.id);

    // Get user stats using client (respects RLS - user can only see their own)
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

    // Get all achievement definitions (public data)
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

      // Update or insert progress using admin client (RLS blocks upserts for this table)
      const { error: progressError } = await supabaseAdmin
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

      // If newly earned, add to achievements table using admin client (bypasses RLS)
      if (isEarned) {
        console.log('New achievement earned:', achievement.title);
        
        const { error: achievementError } = await supabaseAdmin
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

        // Update user points and level using admin client
        const newPoints = userStats.total_points + achievement.points;
        const newLevel = Math.floor(newPoints / 100) + 1;

        await supabaseAdmin
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
        headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
