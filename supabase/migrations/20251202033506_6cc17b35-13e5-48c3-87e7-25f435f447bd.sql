-- Drop the overly permissive policy that exposes all achievements
DROP POLICY IF EXISTS "Users can view all achievements" ON public.achievements;

-- The "Users can view own achievements" policy should already exist, but let's ensure it does
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'achievements' 
    AND policyname = 'Users can view own achievements'
  ) THEN
    CREATE POLICY "Users can view own achievements" 
    ON public.achievements 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
END $$;