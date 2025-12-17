-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('client', 'marketer'))
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies (Permissions)

-- Allow anyone to read profiles (needed for the App to check the role)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow users to insert their *own* profile during sign up
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their *own* profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. OPTIONAL: Fix for your current "Role Not Found" user
-- If you are currently logged in but have no role, run this line (replace 'marketer' with 'client' if you prefer):
-- INSERT INTO public.profiles (id, role)
-- VALUES ('YOUR_USER_ID_HERE', 'marketer');
