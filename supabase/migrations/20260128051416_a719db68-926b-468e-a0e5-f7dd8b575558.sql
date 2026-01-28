-- Fix: Require authentication to view workout shares (prevents anonymous tracking)

DROP POLICY IF EXISTS "Users can view public shares and their own" ON public.workout_shares;

CREATE POLICY "Authenticated users can view public shares and their own"
ON public.workout_shares FOR SELECT
TO authenticated
USING (is_public OR (auth.uid() = user_id) OR (auth.uid() = shared_with_id));