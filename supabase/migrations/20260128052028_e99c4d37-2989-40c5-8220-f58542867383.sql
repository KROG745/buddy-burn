-- Allow users to view scheduled_workouts that have been shared publicly via workout_shares
CREATE POLICY "Users can view publicly shared workouts"
ON public.scheduled_workouts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM workout_shares ws
    WHERE ws.workout_id = scheduled_workouts.id
    AND ws.is_public = true
  )
);