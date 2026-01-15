-- Fix RLS policy gaps identified by security scan

-- 1. Restrict profiles SELECT to authenticated users only
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view public profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  -- Users can always see their own profile
  auth.uid() = id
  OR
  -- Can see public profiles of other users
  is_public = true
  OR
  -- Can see profiles of friends
  EXISTS (
    SELECT 1 FROM public.friends
    WHERE friends.user_id = auth.uid() AND friends.friend_id = profiles.id
  )
);

-- 2. Tighten scheduled_workouts visibility to friends only (fix location exposure)
DROP POLICY IF EXISTS "Users can view scheduled workouts at same location" ON public.scheduled_workouts;

CREATE POLICY "Users can view their own scheduled workouts"
ON public.scheduled_workouts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends scheduled workouts at same location"
ON public.scheduled_workouts FOR SELECT
TO authenticated
USING (
  -- Can see workout if:
  -- 1. The workout owner is a friend
  EXISTS (
    SELECT 1 FROM public.friends
    WHERE friends.user_id = auth.uid() AND friends.friend_id = scheduled_workouts.user_id
  )
  AND
  -- 2. The friend has not hidden their location
  NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = scheduled_workouts.user_id AND profiles.hide_location_from_friends = true
  )
);

-- 3. Add explicit DENY for notifications INSERT (system only via triggers/edge functions)
CREATE POLICY "Users cannot directly insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (false);

-- 4. Add explicit DENY for achievements DELETE (permanent records)
CREATE POLICY "Users cannot delete achievements"
ON public.achievements FOR DELETE
TO authenticated
USING (false);

-- 5. Add DELETE policies for friend_requests (allow sender to cancel, receiver to reject)
CREATE POLICY "Users can delete their sent friend requests"
ON public.friend_requests FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete friend requests sent to them"
ON public.friend_requests FOR DELETE
TO authenticated
USING (auth.uid() = receiver_id);

-- 6. Add explicit DENY for user_achievement_progress DELETE (preserve history)
CREATE POLICY "Users cannot delete achievement progress"
ON public.user_achievement_progress FOR DELETE
TO authenticated
USING (false);

-- 7. Add explicit DENY for user_stats DELETE (preserve statistics)
CREATE POLICY "Users cannot delete their stats"
ON public.user_stats FOR DELETE
TO authenticated
USING (false);

-- 8. Add UPDATE policy for workout_shares (users can update their own)
CREATE POLICY "Users can update their own workout shares"
ON public.workout_shares FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);