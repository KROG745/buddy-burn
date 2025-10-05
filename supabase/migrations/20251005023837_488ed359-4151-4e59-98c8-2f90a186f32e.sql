-- Add privacy field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_public boolean DEFAULT true;

-- Update the RLS policy for profiles to respect privacy settings
-- Drop the existing public view policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create new policy that respects privacy settings
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (
  -- User can always see their own profile
  auth.uid() = id 
  OR 
  -- Public profiles are visible to everyone
  is_public = true
  OR
  -- Private profiles are only visible to friends
  (
    is_public = false 
    AND EXISTS (
      SELECT 1 FROM public.friends 
      WHERE (user_id = auth.uid() AND friend_id = profiles.id)
      OR (user_id = profiles.id AND friend_id = auth.uid())
    )
  )
);