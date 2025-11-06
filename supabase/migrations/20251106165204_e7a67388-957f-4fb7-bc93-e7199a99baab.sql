-- Drop existing policies on crop_recommendations table
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.crop_recommendations;
DROP POLICY IF EXISTS "Users can create their own recommendations" ON public.crop_recommendations;
DROP POLICY IF EXISTS "Users can update their own recommendations" ON public.crop_recommendations;
DROP POLICY IF EXISTS "Users can delete their own recommendations" ON public.crop_recommendations;

-- Create strengthened RLS policies with explicit authentication requirements

-- SELECT: Only authenticated users can view their own recommendations
CREATE POLICY "Authenticated users can view only their own recommendations"
ON public.crop_recommendations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- INSERT: Only authenticated users can create their own recommendations
CREATE POLICY "Authenticated users can insert only their own recommendations"
ON public.crop_recommendations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- UPDATE: Only authenticated users can update their own recommendations
CREATE POLICY "Authenticated users can update only their own recommendations"
ON public.crop_recommendations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- DELETE: Only authenticated users can delete their own recommendations
CREATE POLICY "Authenticated users can delete only their own recommendations"
ON public.crop_recommendations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Ensure RLS is enabled (defensive)
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;

-- Add security documentation
COMMENT ON TABLE public.crop_recommendations IS 'Crop recommendations with sensitive GPS coordinates (latitude/longitude). RLS policies enforce strict user-scoped access with explicit authentication requirements. Protected against anonymous access and RLS bypass attempts.';

COMMENT ON COLUMN public.crop_recommendations.latitude IS 'Sensitive: GPS latitude coordinate of farm location. Protected by RLS policies.';
COMMENT ON COLUMN public.crop_recommendations.longitude IS 'Sensitive: GPS longitude coordinate of farm location. Protected by RLS policies.';
COMMENT ON COLUMN public.crop_recommendations.location IS 'Sensitive: Text description of farm location. Protected by RLS policies.';