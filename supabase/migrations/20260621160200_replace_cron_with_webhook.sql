-- Unschedule the previous cron job to save free tier invocations
SELECT cron.unschedule('embed-market-alerts');

-- Create a function that triggers the embed-market-alerts Edge Function
CREATE OR REPLACE FUNCTION public.trigger_embed_market_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- We use pg_net to make an asynchronous HTTP POST request.
  -- This ensures the database transaction isn't blocked waiting for the AI embedding.
  PERFORM net.http_post(
      url:='https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/embed-market-alerts',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body:='{}'::jsonb
  );
  RETURN NEW;
END;
$$;

-- Attach the trigger to the market_alerts table
-- We only fire it on INSERT, meaning 0 wasted invocations!
DROP TRIGGER IF EXISTS on_market_alert_created ON public.market_alerts;
CREATE TRIGGER on_market_alert_created
AFTER INSERT ON public.market_alerts
FOR EACH ROW
EXECUTE FUNCTION public.trigger_embed_market_alerts();
