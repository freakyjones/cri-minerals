CREATE TYPE user_role AS ENUM ('user', 'admin');

ALTER TABLE public.profiles 
ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Set initial admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'abhilashpandey8170@gmail.com');
