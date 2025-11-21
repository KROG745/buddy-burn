-- Change default value of is_public to false for better privacy
ALTER TABLE public.profiles 
ALTER COLUMN is_public SET DEFAULT false;