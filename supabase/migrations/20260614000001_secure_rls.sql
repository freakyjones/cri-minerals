-- 1. Secure market_alerts table
DROP POLICY IF EXISTS "Allow public delete access for all alerts" ON public.market_alerts;
DROP POLICY IF EXISTS "Allow public update access for all alerts" ON public.market_alerts;

CREATE POLICY "Allow admin delete access for all alerts" ON public.market_alerts
FOR DELETE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow admin update access for all alerts" ON public.market_alerts
FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
) WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Secure profiles table (Prevent Privilege Escalation)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger AS $$
DECLARE
  current_uid uuid;
  current_role user_role;
BEGIN
  -- Only intervene if the role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    current_uid := auth.uid();
    
    -- If executed from a frontend client, auth.uid() is not null
    IF current_uid IS NOT NULL THEN
      SELECT role INTO current_role FROM public.profiles WHERE id = current_uid;
      
      -- If the user making the request is not an admin, revert the role change silently.
      IF current_role IS NULL OR current_role != 'admin' THEN
        NEW.role = OLD.role;
      END IF;
    END IF;
    -- If auth.uid() is null (e.g. Supabase Studio or Service Role), allow the change.
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_profile_role_unchanged ON public.profiles;

CREATE TRIGGER ensure_profile_role_unchanged
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();
