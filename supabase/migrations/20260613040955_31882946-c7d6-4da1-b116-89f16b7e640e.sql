-- Functions grant EXECUTE to PUBLIC by default; revoke from PUBLIC so anon/authenticated lose direct access
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_friend_request() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_friend_request_accepted() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_friend_request_rate_limit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_workout_schedule_rate_limit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_report_rate_limit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;

-- get_shared_workout_details: callable only by signed-in users (enforces auth.uid() internally)
REVOKE EXECUTE ON FUNCTION public.get_shared_workout_details(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_workout_details(uuid[]) TO authenticated;

-- Achievement catalog: require sign-in (only read by authenticated features/edge functions)
REVOKE SELECT ON public.achievement_definitions FROM anon;
DROP POLICY IF EXISTS "Achievement definitions are viewable by everyone" ON public.achievement_definitions;
CREATE POLICY "Achievement definitions are viewable by authenticated users"
ON public.achievement_definitions
FOR SELECT
TO authenticated
USING (true);