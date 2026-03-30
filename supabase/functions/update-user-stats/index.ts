import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    if (isRateLimited(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    const body = await req.json();
    const { workoutCompleted, workoutType, friendAdded, workoutShared } = body;

    // Validate input types
    if (workoutCompleted !== undefined && typeof workoutCompleted !== 'boolean') {
      throw new Error('Invalid input: workoutCompleted must be boolean');
    }
    if (workoutType !== undefined && typeof workoutType !== 'string') {
      throw new Error('Invalid input: workoutType must be string');
    }
    if (friendAdded !== undefined && typeof friendAdded !== 'boolean') {
      throw new Error('Invalid input: friendAdded must be boolean');
    }
    if (workoutShared !== undefined && typeof workoutShared !== 'boolean') {
      throw new Error('Invalid input: workoutShared must be boolean');
    }

    // Get or create user stats via admin client
    let { data: userStats } = await supabaseAdmin
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!userStats) {
      const { data: newStats, error } = await supabaseAdmin
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

    const updatedStats: Record<string, unknown> = {};

    if (workoutCompleted) {
      updatedStats.total_workouts = (userStats.total_workouts || 0) + 1;

      const today = new Date().toISOString().split('T')[0];
      const lastWorkout = userStats.last_workout_date;

      if (!lastWorkout) {
        updatedStats.current_streak = 1;
        updatedStats.longest_streak = 1;
      } else {
        const lastDate = new Date(lastWorkout);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          updatedStats.current_streak = (userStats.current_streak || 0) + 1;
          updatedStats.longest_streak = Math.max(
            updatedStats.current_streak as number,
            userStats.longest_streak || 0
          );
        } else if (daysDiff > 1) {
          updatedStats.current_streak = 1;
        }
      }

      updatedStats.last_workout_date = today;
    }

    if (workoutType && typeof workoutType === 'string') {
      const types = userStats.workout_types_completed || [];
      const normalizedType = workoutType.toLowerCase().replace(' training', '').slice(0, 50);
      if (!types.includes(normalizedType)) {
        updatedStats.workout_types_completed = [...types, normalizedType];
      }
    }

    if (friendAdded) {
      updatedStats.total_friends = (userStats.total_friends || 0) + 1;
    }

    if (workoutShared) {
      updatedStats.total_shares = (userStats.total_shares || 0) + 1;
    }

    if (Object.keys(updatedStats).length > 0) {
      const { error } = await supabaseAdmin
        .from('user_stats')
        .update(updatedStats)
        .eq('user_id', user.id);

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error updating user stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update stats' }),
      { headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
