-- Create scheduled_workouts table
CREATE TABLE public.scheduled_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workout_type text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  duration text,
  location text NOT NULL,
  location_normalized text, -- For better matching
  notes text,
  intensity text DEFAULT 'medium',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_workouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own scheduled workouts"
ON public.scheduled_workouts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view scheduled workouts at same location"
ON public.scheduled_workouts
FOR SELECT
USING (
  -- Users can see workouts at the same location if:
  -- 1. The profile is public OR
  -- 2. They are friends with the user
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = scheduled_workouts.user_id 
    AND (
      profiles.is_public = true 
      OR EXISTS (
        SELECT 1 FROM public.friends 
        WHERE (user_id = auth.uid() AND friend_id = scheduled_workouts.user_id)
        OR (user_id = scheduled_workouts.user_id AND friend_id = auth.uid())
      )
    )
  )
);

CREATE POLICY "Users can insert own scheduled workouts"
ON public.scheduled_workouts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled workouts"
ON public.scheduled_workouts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled workouts"
ON public.scheduled_workouts
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance on location queries
CREATE INDEX idx_scheduled_workouts_location ON public.scheduled_workouts(location_normalized, date, time);
CREATE INDEX idx_scheduled_workouts_user ON public.scheduled_workouts(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_scheduled_workouts_updated_at
BEFORE UPDATE ON public.scheduled_workouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();