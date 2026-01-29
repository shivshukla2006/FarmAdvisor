-- Allow admins to manage weather alerts
CREATE POLICY "Admins can insert weather alerts"
ON public.weather_alerts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update weather alerts"
ON public.weather_alerts
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete weather alerts"
ON public.weather_alerts
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Allow admins to manage government schemes
CREATE POLICY "Admins can insert government schemes"
ON public.government_schemes
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update government schemes"
ON public.government_schemes
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete government schemes"
ON public.government_schemes
FOR DELETE
TO authenticated
USING (public.is_admin());