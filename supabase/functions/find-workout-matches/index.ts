import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create client with user's token for auth check
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

    const { workout_type, location, date } = await req.json();

    // Use service role to query across users (RLS blocks cross-user reads)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Find scheduled workouts from other users with public profiles at similar locations
    const { data: matches, error } = await adminClient
      .from("scheduled_workouts")
      .select(`
        id,
        workout_type,
        date,
        time,
        location,
        location_normalized,
        duration,
        intensity,
        user_id,
        profiles!inner (
          id,
          display_name,
          avatar_url,
          username,
          experience_level,
          is_public
        )
      `)
      .neq("user_id", user.id)
      .eq("profiles.is_public", true);

    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Score and filter matches based on similarity
    const normalizeLocation = (loc: string) =>
      loc?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

    const inputLocationNorm = normalizeLocation(location || "");
    const inputType = workout_type?.toLowerCase() || "";

    const scoredMatches = (matches || [])
      .map((m: any) => {
        let score = 0;
        const profile = m.profiles;

        // Location match (highest priority)
        const matchLocNorm = normalizeLocation(m.location);
        if (inputLocationNorm && matchLocNorm === inputLocationNorm) {
          score += 3; // Exact location match
        } else if (
          inputLocationNorm &&
          (matchLocNorm.includes(inputLocationNorm) ||
            inputLocationNorm.includes(matchLocNorm))
        ) {
          score += 2; // Partial location match
        }

        // Workout type match
        if (inputType && m.workout_type?.toLowerCase() === inputType) {
          score += 2;
        }

        // Date match
        if (date && m.date === date) {
          score += 1;
        }

        return {
          id: m.user_id,
          name: profile?.display_name || profile?.username || "User",
          avatar: profile?.avatar_url || "/placeholder.svg",
          workoutType: m.workout_type,
          location: m.location,
          time: m.time,
          fitnessLevel: profile?.experience_level || "Not specified",
          isOnline: false, // Can't determine from DB
          score,
          workoutDate: m.date,
        };
      })
      .filter((m: any) => m.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    // Deduplicate by user id (keep highest scored)
    const seen = new Set();
    const deduped = scoredMatches.filter((m: any) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Fetch pending friend requests and existing friendships for matched users
    const matchedIds = deduped.map((m: any) => m.id);

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
