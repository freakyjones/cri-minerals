-- Enable the pg_net extension to make HTTP requests from the database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Note: Replace 'YOUR_PROJECT_REF' and 'YOUR_ANON_KEY' with actual project values
-- if deploying this migration to production. Or configure this schedule
-- directly in the Supabase Dashboard under Database -> Cron Jobs.

SELECT cron.schedule(
  'generate-daily-market-alerts',
  '0 8 * * *', -- Runs every day at 8:00 AM UTC
  $$
    SELECT net.http_post(
        url := 'https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/generate-market-alerts',
        headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    );
  $$
);
