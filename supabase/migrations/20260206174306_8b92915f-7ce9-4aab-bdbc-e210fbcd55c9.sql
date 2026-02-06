-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (is_admin());

-- Allow admins to view all user activities
CREATE POLICY "Admins can view all activities"
ON public.user_activities
FOR SELECT
USING (is_admin());