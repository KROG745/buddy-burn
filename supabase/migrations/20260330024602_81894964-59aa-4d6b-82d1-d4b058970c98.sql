
-- Rate limiting function for friend requests (max 10 per hour per user)
CREATE OR REPLACE FUNCTION public.check_friend_request_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.friend_requests
  WHERE sender_id = NEW.sender_id
    AND created_at > NOW() - INTERVAL '1 hour';

  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 10 friend requests per hour';
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to friend_requests table
CREATE TRIGGER enforce_friend_request_rate_limit
  BEFORE INSERT ON public.friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.check_friend_request_rate_limit();

-- Rate limiting function for scheduled workouts (max 20 per hour per user)
CREATE OR REPLACE FUNCTION public.check_workout_schedule_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.scheduled_workouts
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 hour';

  IF recent_count >= 20 THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 20 scheduled workouts per hour';
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to scheduled_workouts table
CREATE TRIGGER enforce_workout_schedule_rate_limit
  BEFORE INSERT ON public.scheduled_workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.check_workout_schedule_rate_limit();
