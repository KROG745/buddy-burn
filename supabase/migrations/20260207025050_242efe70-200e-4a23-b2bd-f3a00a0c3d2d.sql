
-- Drop the existing policy that exposes location data to all authenticated users
DROP POLICY IF EXISTS "Users can view publicly shared workouts" ON public.scheduled_workouts;

-- Create a secure function that returns shared workout details with location masked
-- for non-owner/non-friend viewers (prevents location tracking by strangers)
CREATE OR REPLACE FUNCTION public.get_shared_workout_details(p_workout_ids uuid[])
RETURNS TABLE (
  id uuid,
  workout_type text,
  date date,
  "time" text,
  duration text,
  intensity text,
  notes text,
  user_id uuid,
  location text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    sw.id,
    sw.workout_type,
    sw.date,
    sw.time,
    sw.duration,
    sw.intensity,
    sw.notes,
    sw.user_id,
    CASE
      -- Owner sees full data
      WHEN sw.user_id = auth.uid() THEN sw.location
      -- Friends see location if owner hasn't hidden it
      WHEN EXISTS (
        SELECT 1 FROM friends f 
        WHERE f.user_id = auth.uid() AND f.friend_id = sw.user_id
      ) AND NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = sw.user_id AND p.hide_location_from_friends = true
      ) THEN sw.location
      -- Public viewers never see location (prevents tracking)
      ELSE 'Location hidden'::text
    END as location,
    sw.created_at,
    sw.updated_at
  FROM scheduled_workouts sw
  WHERE sw.id = ANY(p_workout_ids)
    AND (
      -- Owner can always see their own
      sw.user_id = auth.uid()
      -- Friends can see (location privacy handled in CASE above)
      OR EXISTS (
        SELECT 1 FROM friends f 
        WHERE f.user_id = auth.uid() AND f.friend_id = sw.user_id
      )
      -- Public shares are visible (but location masked in CASE above)
      OR EXISTS (
        SELECT 1 FROM workout_shares ws 
        WHERE ws.workout_id = sw.id AND ws.is_public = true
      )
    );
END;
$$;
