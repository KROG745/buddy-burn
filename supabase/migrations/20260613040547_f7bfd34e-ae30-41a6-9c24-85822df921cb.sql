-- 1. Fix one-sided friend deletion
DROP POLICY IF EXISTS "Users can delete their friendships" ON public.friends;
CREATE POLICY "Users can delete their friendships"
ON public.friends
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 2. Revoke direct EXECUTE on SECURITY DEFINER trigger/internal functions.
-- These are invoked by triggers, not directly by clients, so they don't need
-- to be callable from the exposed API by anon/authenticated.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_friend_request() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_friend_request_accepted() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_friend_request_rate_limit() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_workout_schedule_rate_limit() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_report_rate_limit() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- get_shared_workout_details is intentionally called via RPC by signed-in users.
-- Keep it callable by authenticated, but not by anonymous visitors.
REVOKE EXECUTE ON FUNCTION public.get_shared_workout_details(uuid[]) FROM anon;