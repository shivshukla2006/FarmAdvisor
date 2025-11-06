-- Add additional security layer: Ensure profiles table has proper constraints
-- This migration adds extra defensive measures to make security even more explicit

-- Add constraint to ensure user_id (id) cannot be NULL
-- (defensive programming - should already be enforced by primary key)
ALTER TABLE public.profiles 
  ALTER COLUMN id SET NOT NULL;

-- Create a security function to verify profile access
-- This provides an additional layer of verification
CREATE OR REPLACE FUNCTION public.can_access_profile(profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    auth.uid() IS NOT NULL 
    AND auth.uid() = profile_id;
$$;

-- Add additional documentation about security model
COMMENT ON COLUMN public.profiles.email IS 'Sensitive PII: Email address. Protected by RLS - only accessible by the profile owner when authenticated. Anonymous access completely blocked.';
COMMENT ON COLUMN public.profiles.phone IS 'Sensitive PII: Phone number. Protected by RLS - only accessible by the profile owner when authenticated. Anonymous access completely blocked.';

-- Verify RLS is enabled (defensive check)
DO $$
BEGIN
  IF NOT (
    SELECT relrowsecurity 
    FROM pg_class 
    WHERE relname = 'profiles' 
    AND relnamespace = 'public'::regnamespace
  ) THEN
    RAISE EXCEPTION 'CRITICAL SECURITY ERROR: RLS is not enabled on profiles table';
  END IF;
END $$;