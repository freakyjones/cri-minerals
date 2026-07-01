-- 1. Restrict public read access to only PUBLISHED alerts
DROP POLICY IF EXISTS "Allow public read access for all alerts" ON public.market_alerts;

CREATE POLICY "Allow public read access for published alerts" ON public.market_alerts
FOR SELECT USING (
  status = 'PUBLISHED' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
