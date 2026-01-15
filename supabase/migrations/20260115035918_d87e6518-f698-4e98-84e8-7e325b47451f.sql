-- Harden SECURITY DEFINER functions with search_path protection and authorization checks

-- 1. Update handle_new_user() with search_path protection
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'display_name', 'user') || '_' || SUBSTRING(NEW.id::TEXT, 1, 8), '[^a-z0-9_]', '', 'g'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- 2. Update notify_friend_request() with authorization check and search_path protection
CREATE OR REPLACE FUNCTION public.notify_friend_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Verify sender_id matches authenticated user (defense in depth)
  IF NEW.sender_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: sender_id must match authenticated user';
  END IF;

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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- 3. Update handle_friend_request_accepted() with authorization check and search_path protection
CREATE OR REPLACE FUNCTION public.handle_friend_request_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Verify receiver_id matches authenticated user (only receiver can accept)
    IF NEW.receiver_id != auth.uid() THEN
      RAISE EXCEPTION 'Unauthorized: only the receiver can accept friend requests';
    END IF;

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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;