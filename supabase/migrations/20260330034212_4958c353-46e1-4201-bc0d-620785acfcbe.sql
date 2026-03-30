
-- 1. Remove direct INSERT/UPDATE on user_achievement_progress (only server-side should modify)
DROP POLICY IF EXISTS "Users can insert own achievement progress" ON public.user_achievement_progress;
DROP POLICY IF EXISTS "Users can update own achievement progress" ON public.user_achievement_progress;

-- Replace with server-only (deny) policies
CREATE POLICY "No direct achievement progress inserts" ON public.user_achievement_progress
  FOR INSERT TO authenticated WITH CHECK (false);

CREATE POLICY "No direct achievement progress updates" ON public.user_achievement_progress
  FOR UPDATE TO authenticated USING (false);

-- 2. Remove direct INSERT/UPDATE on user_stats (only server-side should modify)
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

-- Replace with server-only (deny) policies
CREATE POLICY "No direct stats inserts" ON public.user_stats
  FOR INSERT TO authenticated WITH CHECK (false);

CREATE POLICY "No direct stats updates" ON public.user_stats
  FOR UPDATE TO authenticated USING (false);

-- 3. Add WITH CHECK to friend_requests UPDATE policy to restrict field changes
DROP POLICY IF EXISTS "Users can update received requests" ON public.friend_requests;

CREATE POLICY "Users can update received requests" ON public.friend_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (
    auth.uid() = receiver_id
    AND sender_id = sender_id
    AND receiver_id = receiver_id
  );
