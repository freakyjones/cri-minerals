-- Schedule the embedding job to run every 1 minute
-- This fully decouples the LLM text generation from the LLM embedding generation
SELECT cron.schedule(
  'embed-market-alerts',
  '* * * * *',
  $$
  SELECT net.http_post(
      url:='https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/embed-market-alerts',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body:='{}'::jsonb
  ) as request_id;
  $$
);
