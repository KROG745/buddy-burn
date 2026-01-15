-- Fix the scheduled_workouts policy - when hide_location_from_friends is true, 
-- friends should NOT be able to see ANY workout data, not just filtered by location

DROP POLICY IF EXISTS "Users can view friends scheduled workouts at same location" ON public.scheduled_workouts;

CREATE POLICY "Users can view friends scheduled workouts"
ON public.scheduled_workouts FOR SELECT
TO authenticated
USING (
  -- Can see workout ONLY if:
  -- 1. The workout owner is a friend
  EXISTS (
    SELECT 1 FROM public.friends
    WHERE friends.user_id = auth.uid() AND friends.friend_id = scheduled_workouts.user_id
  )
  AND
  -- 2. The friend has NOT enabled hide_location_from_friends (must explicitly allow)
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = scheduled_workouts.user_id 
    AND profiles.hide_location_from_friends = false
  )
);