-- Seed script for Apple App Store Review Test Account
-- Email: applereviewer@buddy-burn.app
-- Password: AppleReview2026!
-- 
-- INSTRUCTIONS:
-- 1. First create the user in Supabase Auth Dashboard with the credentials above
-- 2. Copy the user's UUID from the Auth dashboard
-- 3. Replace 'APPLE_REVIEWER_USER_ID' below with that UUID
-- 4. Run this script in the Supabase SQL Editor

-- Set the reviewer's user ID here (get this from Auth dashboard after creating the user)
DO $$
DECLARE
  reviewer_id UUID := '4317ecfa-6f3d-433a-80e8-d8a377752313'; -- Apple reviewer UUID
  demo_friend_1 UUID := gen_random_uuid();
  demo_friend_2 UUID := gen_random_uuid();
  demo_friend_3 UUID := gen_random_uuid();
BEGIN

  -- Update the reviewer's profile with complete data
  UPDATE public.profiles
  SET 
    display_name = 'Alex Reviewer',
    username = 'alex_reviewer',
    bio = 'Fitness enthusiast testing the app! 💪',
    fitness_goal = 'Build strength and stay active',
    experience_level = 'intermediate',
    is_public = true,
    hide_location_from_friends = false
  WHERE id = reviewer_id;

  -- Create user stats for the reviewer
  INSERT INTO public.user_stats (user_id, total_workouts, current_streak, longest_streak, total_friends, total_shares, total_points, level, workout_types_completed, last_workout_date)
  VALUES (
    reviewer_id,
    28,
    5,
    12,
    3,
    8,
    450,
    4,
    ARRAY['running', 'weightlifting', 'yoga', 'cycling', 'hiit'],
    CURRENT_DATE - INTERVAL '1 day'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_workouts = 28,
    current_streak = 5,
    longest_streak = 12,
    total_friends = 3,
    total_shares = 8,
    total_points = 450,
    level = 4,
    workout_types_completed = ARRAY['running', 'weightlifting', 'yoga', 'cycling', 'hiit'],
    last_workout_date = CURRENT_DATE - INTERVAL '1 day';

  -- Insert sample achievements for the reviewer (using valid type values from check constraint)
  INSERT INTO public.achievements (user_id, title, description, type, icon)
  VALUES
    (reviewer_id, 'First Workout', 'Completed your first workout!', 'first_workout', 'trophy'),
    (reviewer_id, 'Week Warrior', 'Worked out 7 days in a row', 'week_streak', 'flame'),
    (reviewer_id, '10 Workouts Strong', 'Completed 10 total workouts', 'workout_count_10', 'medal'),
    (reviewer_id, 'Social Butterfly', 'Made 5 friends', 'friend_count_5', 'users'),
    (reviewer_id, '50 Workouts Strong', 'Completed 50 total workouts', 'workout_count_50', 'star');

  -- Insert sample scheduled workouts (past, today, and upcoming)
  INSERT INTO public.scheduled_workouts (user_id, workout_type, date, time, duration, location, intensity, notes)
  VALUES
    -- Past workouts
    (reviewer_id, 'Running', CURRENT_DATE - INTERVAL '5 days', '07:00', '45 min', 'Central Park', 'medium', 'Morning jog to start the week'),
    (reviewer_id, 'Weightlifting', CURRENT_DATE - INTERVAL '4 days', '18:00', '60 min', 'Gold''s Gym', 'high', 'Upper body focus'),
    (reviewer_id, 'Yoga', CURRENT_DATE - INTERVAL '3 days', '06:30', '30 min', 'Home', 'low', 'Morning stretch routine'),
    (reviewer_id, 'HIIT', CURRENT_DATE - INTERVAL '2 days', '17:30', '40 min', 'CrossFit Box', 'high', 'Intense interval session'),
    (reviewer_id, 'Cycling', CURRENT_DATE - INTERVAL '1 day', '08:00', '90 min', 'Riverside Trail', 'medium', 'Long weekend ride'),
    -- Today's workout
    (reviewer_id, 'Weightlifting', CURRENT_DATE, '18:00', '60 min', 'Gold''s Gym', 'high', 'Leg day!'),
    -- Upcoming workouts
    (reviewer_id, 'Running', CURRENT_DATE + INTERVAL '1 day', '07:00', '30 min', 'Central Park', 'medium', 'Easy recovery run'),
    (reviewer_id, 'Yoga', CURRENT_DATE + INTERVAL '2 days', '19:00', '45 min', 'Yoga Studio Downtown', 'low', 'Evening relaxation'),
    (reviewer_id, 'Swimming', CURRENT_DATE + INTERVAL '3 days', '12:00', '45 min', 'Community Pool', 'medium', 'Lunch break swim');

  -- Insert achievement progress (using valid IDs from achievement_definitions table)
  INSERT INTO public.user_achievement_progress (user_id, achievement_id, current_progress, is_completed, completed_at)
  VALUES
    (reviewer_id, 'first_workout', 1, true, NOW() - INTERVAL '3 weeks'),
    (reviewer_id, 'streak_7', 7, true, NOW() - INTERVAL '2 weeks'),
    (reviewer_id, '10_workouts', 10, true, NOW() - INTERVAL '1 week'),
    (reviewer_id, 'first_friend', 1, true, NOW() - INTERVAL '2 weeks'),
    (reviewer_id, 'try_cardio', 1, true, NOW() - INTERVAL '1 week'),
    (reviewer_id, '25_workouts', 25, true, NOW() - INTERVAL '2 days'),
    (reviewer_id, '50_workouts', 28, false, NULL),
    (reviewer_id, 'streak_30', 5, false, NULL);

  RAISE NOTICE 'Successfully seeded data for Apple reviewer account!';
  RAISE NOTICE 'User ID: %', reviewer_id;

END $$;

-- Note: Friend relationships require actual auth users.
-- For the demo, the ActivityFeed component uses mock data which will display.
-- If you want real friend data, you'll need to create additional test auth users
-- and run friend relationship inserts with their actual UUIDs.
