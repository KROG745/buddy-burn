-- Fix critical security issues

-- 1. CRITICAL: Fix achievements table INSERT policy
-- Remove the overly permissive policy and replace with user-specific access
DROP POLICY IF EXISTS "System can insert achievements" ON public.achievements;

-- Only allow users to view their own achievements
CREATE POLICY "Users can view own achievements" 
ON public.achievements 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Only allow authenticated edge functions or SECURITY DEFINER functions to insert achievements
-- This prevents direct client-side manipulation
CREATE POLICY "Only system can insert achievements" 
ON public.achievements 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- 2. Add explicit deny policy to friends table to prevent bypass attempts
DROP POLICY IF EXISTS "No direct friendship inserts" ON public.friends;

CREATE POLICY "No direct friendship inserts" 
ON public.friends 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- 3. Ensure the check-achievements edge function can still insert achievements
-- by using the service role key (it already does this)

COMMENT ON POLICY "Only system can insert achievements" ON public.achievements IS 
'Achievements can only be inserted via edge functions using service role authentication. This prevents client-side manipulation of the achievement system.';