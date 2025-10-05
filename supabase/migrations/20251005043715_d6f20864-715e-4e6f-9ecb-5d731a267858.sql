-- Create achievement_definitions table to store all possible achievements
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'milestone', 'streak', 'social', 'variety'
  rarity TEXT NOT NULL DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  requirement_type TEXT NOT NULL, -- 'workout_count', 'streak_days', 'friend_count', 'workout_types', 'share_count'
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievement_progress table to track progress towards achievements
CREATE TABLE IF NOT EXISTS public.user_achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id TEXT NOT NULL REFERENCES achievement_definitions(id),
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create user_stats table for tracking streaks and counts
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  total_workouts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  total_friends INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  workout_types_completed TEXT[] DEFAULT '{}',
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievement_definitions (public read)
CREATE POLICY "Achievement definitions are viewable by everyone"
ON public.achievement_definitions FOR SELECT
USING (true);

-- RLS Policies for user_achievement_progress
CREATE POLICY "Users can view own achievement progress"
ON public.user_achievement_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievement progress"
ON public.user_achievement_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
ON public.user_achievement_progress FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view own stats"
ON public.user_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
ON public.user_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
ON public.user_stats FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_achievement_progress_updated_at
BEFORE UPDATE ON public.user_achievement_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert achievement definitions
INSERT INTO public.achievement_definitions (id, title, description, icon, category, rarity, requirement_type, requirement_value, points) VALUES
-- Workout Milestones
('first_workout', 'First Steps', 'Complete your first workout', '🎯', 'milestone', 'common', 'workout_count', 1, 10),
('10_workouts', 'Getting Started', 'Complete 10 workouts', '💪', 'milestone', 'common', 'workout_count', 10, 25),
('25_workouts', 'Committed', 'Complete 25 workouts', '🔥', 'milestone', 'rare', 'workout_count', 25, 50),
('50_workouts', 'Dedicated', 'Complete 50 workouts', '⭐', 'milestone', 'rare', 'workout_count', 50, 100),
('100_workouts', 'Century Club', 'Complete 100 workouts', '👑', 'milestone', 'epic', 'workout_count', 100, 250),

-- Streak Achievements
('streak_3', 'Building Momentum', '3-day workout streak', '🔥', 'streak', 'common', 'streak_days', 3, 15),
('streak_7', 'Week Warrior', '7-day workout streak', '⚡', 'streak', 'rare', 'streak_days', 7, 35),
('streak_14', 'Two Week Titan', '14-day workout streak', '🌟', 'streak', 'rare', 'streak_days', 14, 75),
('streak_30', 'Month Master', '30-day workout streak', '🏆', 'streak', 'epic', 'streak_days', 30, 200),

-- Social Achievements
('first_friend', 'Making Friends', 'Add your first friend', '👋', 'social', 'common', 'friend_count', 1, 10),
('first_share', 'Sharing is Caring', 'Share your first workout', '📢', 'social', 'common', 'share_count', 1, 10),
('10_friends', 'Social Butterfly', 'Connect with 10 friends', '🦋', 'social', 'rare', 'friend_count', 10, 50),

-- Variety Achievements
('try_cardio', 'Cardio Curious', 'Complete a Cardio workout', '🏃', 'variety', 'common', 'workout_types', 1, 10),
('try_strength', 'Strength Seeker', 'Complete a Weight Training workout', '💪', 'variety', 'common', 'workout_types', 1, 10),
('try_yoga', 'Yoga Explorer', 'Complete a Yoga workout', '🧘', 'variety', 'common', 'workout_types', 1, 10),
('try_hiit', 'HIIT Hero', 'Complete a HIIT workout', '⚡', 'variety', 'common', 'workout_types', 1, 10),
('all_workout_types', 'Jack of All Trades', 'Try all workout types', '🌈', 'variety', 'epic', 'workout_types', 6, 100)
ON CONFLICT (id) DO NOTHING;