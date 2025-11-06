-- Strengthen profiles table RLS policies to prevent user enumeration
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update only their own profile" ON public.profiles;

-- Create enhanced RLS policies using security definer function
-- These policies explicitly prevent any user enumeration attempts
CREATE POLICY "Users can only select their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.can_access_profile(id));

CREATE POLICY "Users can only insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (public.can_access_profile(id));

CREATE POLICY "Users can only update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.can_access_profile(id))
WITH CHECK (public.can_access_profile(id));

-- Add additional safeguard: prevent any SELECT that doesn't explicitly filter by auth.uid()
-- This is handled by the USING clause above which only allows access when id = auth.uid()

-- Add comment documenting anti-enumeration protection
COMMENT ON TABLE public.profiles IS 'User profiles table with strict RLS policies. Each user can only access their own profile. The can_access_profile() security definer function prevents user enumeration by ensuring auth.uid() matches the profile id.';

-- Add explicit protection comment on sensitive fields
COMMENT ON COLUMN public.profiles.email IS 'Protected by RLS - only accessible to profile owner via can_access_profile() function';
COMMENT ON COLUMN public.profiles.phone IS 'Protected by RLS - only accessible to profile owner via can_access_profile() function';