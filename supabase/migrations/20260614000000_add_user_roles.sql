-- Ensure public.profiles exists for clean environments
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'avatar_url')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Now handle the role additions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
  END IF;
END$$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';

-- Set initial admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'abhilashpandey8170@gmail.com');
