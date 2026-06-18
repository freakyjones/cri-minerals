-- Enable the pg_net extension to make HTTP requests from the database
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable Supabase Vault to securely store environment variables
CREATE EXTENSION IF NOT EXISTS supabase_vault CASCADE;

-- Note: This cron job dynamically retrieves the Edge Function URL and Anon Key 
-- from Supabase Vault at runtime so they aren't hardcoded in this script.
--
-- To set these secrets in your database, run this SQL once per environment:
-- SELECT vault.create_secret('YOUR_EDGE_FUNCTION_URL', 'edge_function_url');
-- SELECT vault.create_secret('YOUR_ANON_KEY', 'edge_function_anon_key');

SELECT cron.schedule(
  'generate-daily-market-alerts',
  '30 19 * * *',
  $$
    SELECT net.http_post(
        url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'edge_function_url' LIMIT 1),
        headers := jsonb_build_object('Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'edge_function_anon_key' LIMIT 1)),
        timeout_milliseconds := 30000
    );
  $$
);
