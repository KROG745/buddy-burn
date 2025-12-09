-- Add location privacy setting to profiles
ALTER TABLE public.profiles 
ADD COLUMN hide_location_from_friends boolean NOT NULL DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.hide_location_from_friends IS 'When true, friends see workout type/time but not location';