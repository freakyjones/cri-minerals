-- Unschedule the old direct cron job
SELECT cron.unschedule('generate-daily-market-alerts');

-- Create the generate_market_alerts_status table
CREATE TABLE IF NOT EXISTS public.generate_market_alerts_status (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'TIMEOUT')),
    triggered_by TEXT NOT NULL DEFAULT 'manual',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Enable RLS and Realtime
ALTER TABLE public.generate_market_alerts_status ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE public.generate_market_alerts_status;

-- Only authenticated users (Analysts) can insert manual runs and view status
CREATE POLICY "Analysts can view queue status" ON public.generate_market_alerts_status FOR SELECT TO authenticated USING (true);
CREATE POLICY "Analysts can insert manual run" ON public.generate_market_alerts_status FOR INSERT TO authenticated WITH CHECK (true);

-- Function to trigger the Edge Function asynchronously via pg_net
CREATE OR REPLACE FUNCTION public.trigger_generate_market_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Fire pg_net to the edge function with the run_id in the body
  PERFORM net.http_post(
      url:='https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/generate-market-alerts',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body:=jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$;

-- Trigger to listen on INSERT to the status table
DROP TRIGGER IF EXISTS on_manual_alert_generation ON public.generate_market_alerts_status;
CREATE TRIGGER on_manual_alert_generation
AFTER INSERT ON public.generate_market_alerts_status
FOR EACH ROW
EXECUTE FUNCTION public.trigger_generate_market_alerts();

-- New cron job that simply inserts into the status table
SELECT cron.schedule(
  'generate-daily-market-alerts-queue',
  '30 19 * * *',
  $$
    INSERT INTO public.generate_market_alerts_status (status, triggered_by)
    VALUES ('PENDING', 'cron');
  $$
);

-- Zombie Reaper Cron Job to handle stalled tasks
SELECT cron.schedule(
  'reap-stalled-market-alerts',
  '*/15 * * * *',
  $$
    UPDATE public.generate_market_alerts_status
    SET status = 'TIMEOUT', error_message = 'Job timed out or stalled', completed_at = NOW()
    WHERE status IN ('PENDING', 'IN_PROGRESS') AND created_at < NOW() - INTERVAL '15 minutes';
  $$
);
