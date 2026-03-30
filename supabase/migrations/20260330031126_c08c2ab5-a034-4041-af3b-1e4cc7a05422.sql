-- User reports table
CREATE TABLE public.user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_user_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT different_users CHECK (reporter_id != reported_user_id)
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON public.user_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON public.user_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- Rate limit: max 5 reports per hour
CREATE OR REPLACE FUNCTION public.check_report_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_reports
      WHERE reporter_id = NEW.reporter_id
      AND created_at > NOW() - INTERVAL '1 hour') >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 5 reports per hour';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_report_rate_limit
  BEFORE INSERT ON public.user_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.check_report_rate_limit();

-- Blocked users table
CREATE TABLE public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CONSTRAINT different_block_users CHECK (blocker_id != blocked_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can block others" ON public.blocked_users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can view own blocks" ON public.blocked_users
  FOR SELECT TO authenticated
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock" ON public.blocked_users
  FOR DELETE TO authenticated
  USING (auth.uid() = blocker_id);