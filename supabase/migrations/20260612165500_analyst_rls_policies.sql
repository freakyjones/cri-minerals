-- Drop the restrictive select policy
DROP POLICY IF EXISTS "Allow public read access for published alerts" ON public.market_alerts;

-- Create permissive policies for the MVP Analyst Dashboard (Anon Role)
CREATE POLICY "Allow public read access for all alerts" 
ON public.market_alerts FOR SELECT 
TO public
USING (true);

CREATE POLICY "Allow public update access for all alerts" 
ON public.market_alerts FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access for all alerts" 
ON public.market_alerts FOR DELETE 
TO public
USING (true);
