-- Enable the pg_net extension to make HTTP requests from the database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Note: Replace 'YOUR_PROJECT_REF' and 'YOUR_ANON_KEY' with actual project values
-- if deploying this migration to production. Or configure this schedule
-- directly in the Supabase Dashboard under Database -> Cron Jobs.

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'generate-daily-market-alerts',
  '30 19 * * *',
  $$
    SELECT net.http_post(
        url := 'https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/generate-market-alerts',
        headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthaHpjbGd1bHhucHNubmxmeHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTQ0ODQsImV4cCI6MjA5NjY5MDQ4NH0.6rinUvsav5E9LUBr2cpViufFlgKMtehZlvCF4H1ReaA"}'::jsonb,
        timeout_milliseconds := 30000
    );
  $$
);
