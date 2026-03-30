import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per edge function instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit per user
    if (isRateLimited(user.id)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { workout_type, location, date } = await req.json();
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Get public profile user IDs
    const { data: publicProfiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, display_name, avatar_url, username, experience_level")
      .eq("is_public", true)
      .neq("id", user.id);

    if (profilesError) {
      console.error("Profiles query error:", profilesError);
      return new Response(JSON.stringify({ error: profilesError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!publicProfiles || publicProfiles.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const publicUserIds = publicProfiles.map((p) => p.id);
    const profileMap = new Map(publicProfiles.map((p) => [p.id, p]));

    // Step 2: Get scheduled workouts for those users
    const { data: workouts, error: workoutsError } = await adminClient
      .from("scheduled_workouts")
      .select("id, workout_type, date, time, location, user_id")
      .in("user_id", publicUserIds);

    if (workoutsError) {
      console.error("Workouts query error:", workoutsError);
      return new Response(JSON.stringify({ error: workoutsError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 3: Score matches
    const normalizeLocation = (loc: string) =>
      loc?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

    const inputLocationNorm = normalizeLocation(location || "");
    const inputType = workout_type?.toLowerCase() || "";

    const scoredMatches = (workouts || [])
      .map((w) => {
        let score = 0;
        const profile = profileMap.get(w.user_id);
        if (!profile) return null;

        const matchLocNorm = normalizeLocation(w.location);
        if (inputLocationNorm && matchLocNorm === inputLocationNorm) {
          score += 3;
        } else if (
          inputLocationNorm &&
          (matchLocNorm.includes(inputLocationNorm) || inputLocationNorm.includes(matchLocNorm))
        ) {
          score += 2;
        }

        if (inputType && w.workout_type?.toLowerCase() === inputType) {
          score += 2;
        }

        if (date && w.date === date) {
          score += 1;
        }

        if (score === 0) return null;

        return {
          id: w.user_id,
          name: profile.display_name || profile.username || "User",
          avatar: profile.avatar_url || "/placeholder.svg",
          workoutType: w.workout_type,
          location: w.location,
          time: w.time,
          fitnessLevel: profile.experience_level || "Not specified",
          isOnline: false,
          score,
          workoutDate: w.date,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    // Deduplicate by user id
    const seen = new Set();
    const deduped = scoredMatches.filter((m: any) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Step 4: Get relationship statuses
    const [friendRequests, friends] = await Promise.all([
      adminClient
        .from("friend_requests")
        .select("sender_id, receiver_id, status")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .in("status", ["pending", "accepted"]),
      adminClient
        .from("friends")
        .select("friend_id")
        .eq("user_id", user.id),
    ]);

    const pendingSet = new Set<string>();
    const friendSet = new Set<string>();

    (friends.data || []).forEach((f: any) => friendSet.add(f.friend_id));
    (friendRequests.data || []).forEach((fr: any) => {
      const otherId = fr.sender_id === user.id ? fr.receiver_id : fr.sender_id;
      if (fr.status === "pending") pendingSet.add(otherId);
    });

    const enriched = deduped.map((m: any) => ({
      ...m,
      relationshipStatus: friendSet.has(m.id)
        ? "friend"
        : pendingSet.has(m.id)
        ? "pending"
        : "none",
    }));

    return new Response(JSON.stringify({ matches: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
