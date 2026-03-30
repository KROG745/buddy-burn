
-- Fix the friend_requests UPDATE policy with proper column immutability checks
DROP POLICY IF EXISTS "Users can update received requests" ON public.friend_requests;

CREATE POLICY "Users can update received requests" ON public.friend_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (
    auth.uid() = receiver_id
    AND status IN ('accepted', 'rejected')
  );
