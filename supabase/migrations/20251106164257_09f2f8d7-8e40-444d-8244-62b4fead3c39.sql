-- Drop existing policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create strengthened RLS policies with explicit authentication requirements

-- SELECT: Only authenticated users can view their own profile
CREATE POLICY "Authenticated users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id AND auth.uid() IS NOT NULL);

-- INSERT: Only authenticated users can create their own profile
CREATE POLICY "Authenticated users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND auth.uid() IS NOT NULL);

-- UPDATE: Only authenticated users can update their own profile
CREATE POLICY "Authenticated users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = id AND auth.uid() IS NOT NULL);

-- Ensure RLS is enabled (should already be, but defensive)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with RLS policies ensuring only authenticated users can access their own data. Protected against anonymous access.';