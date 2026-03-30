
-- Fix RLS policies: change from {public} role to {authenticated} role

-- friend_requests
ALTER POLICY "Users can send friend requests" ON public.friend_requests TO authenticated;
ALTER POLICY "Users can view their friend requests" ON public.friend_requests TO authenticated;
ALTER POLICY "Users can update received requests" ON public.friend_requests TO authenticated;

-- friends
ALTER POLICY "Users can view their friends" ON public.friends TO authenticated;
ALTER POLICY "Users can delete their friendships" ON public.friends TO authenticated;

-- notifications
ALTER POLICY "Users can view own notifications" ON public.notifications TO authenticated;
ALTER POLICY "Users can update own notifications" ON public.notifications TO authenticated;

-- profiles
ALTER POLICY "Users can insert own profile" ON public.profiles TO authenticated;
ALTER POLICY "Users can update own profile" ON public.profiles TO authenticated;

-- scheduled_workouts
ALTER POLICY "Users can insert own scheduled workouts" ON public.scheduled_workouts TO authenticated;
ALTER POLICY "Users can update own scheduled workouts" ON public.scheduled_workouts TO authenticated;
ALTER POLICY "Users can delete own scheduled workouts" ON public.scheduled_workouts TO authenticated;
ALTER POLICY "Users can view own scheduled workouts" ON public.scheduled_workouts TO authenticated;

-- user_achievement_progress
ALTER POLICY "Users can insert own achievement progress" ON public.user_achievement_progress TO authenticated;
ALTER POLICY "Users can update own achievement progress" ON public.user_achievement_progress TO authenticated;
ALTER POLICY "Users can view own achievement progress" ON public.user_achievement_progress TO authenticated;

-- user_stats
ALTER POLICY "Users can insert own stats" ON public.user_stats TO authenticated;
ALTER POLICY "Users can update own stats" ON public.user_stats TO authenticated;
ALTER POLICY "Users can view own stats" ON public.user_stats TO authenticated;

-- workout_shares
ALTER POLICY "Users can create own shares" ON public.workout_shares TO authenticated;
ALTER POLICY "Users can delete own shares" ON public.workout_shares TO authenticated;
