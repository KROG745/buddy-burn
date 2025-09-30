-- Fix security warnings by setting search_path on functions

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'display_name', 'user') || '_' || SUBSTRING(NEW.id::TEXT, 1, 8), '[^a-z0-9_]', '', 'g'))
  );
  RETURN NEW;
END;
$$;

-- Update notify_friend_request function
CREATE OR REPLACE FUNCTION public.notify_friend_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    NEW.receiver_id,
    'friend_request',
    'New Friend Request',
    (SELECT display_name FROM public.profiles WHERE id = NEW.sender_id) || ' sent you a friend request',
    jsonb_build_object('request_id', NEW.id, 'sender_id', NEW.sender_id)
  );
  RETURN NEW;
END;
$$;

-- Update handle_friend_request_accepted function
CREATE OR REPLACE FUNCTION public.handle_friend_request_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Create bidirectional friendship
    INSERT INTO public.friends (user_id, friend_id)
    VALUES (NEW.sender_id, NEW.receiver_id);
    
    INSERT INTO public.friends (user_id, friend_id)
    VALUES (NEW.receiver_id, NEW.sender_id);
    
    -- Notify sender
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      NEW.sender_id,
      'friend_accepted',
      'Friend Request Accepted',
      (SELECT display_name FROM public.profiles WHERE id = NEW.receiver_id) || ' accepted your friend request',
      jsonb_build_object('friend_id', NEW.receiver_id)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;