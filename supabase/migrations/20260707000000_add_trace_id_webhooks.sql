-- Update generate-market-alerts trigger to include trace_id and idempotency-key
CREATE OR REPLACE FUNCTION public.trigger_generate_market_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
      url:='https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/generate-market-alerts',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'trace_id', gen_random_uuid()::text,
        'idempotency-key', NEW.run_id::text
      ),
      body:=jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW),
        'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE null END
      )
  );
  RETURN NEW;
END;
$$;

-- Update send-market-alert-email trigger to include trace_id
CREATE OR REPLACE FUNCTION public.trigger_send_market_alert_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only fire if status was not PUBLISHED and is now PUBLISHED
  -- or if it is an INSERT and is already PUBLISHED
  IF (TG_OP = 'UPDATE' AND OLD.status != 'PUBLISHED' AND NEW.status = 'PUBLISHED') OR
     (TG_OP = 'INSERT' AND NEW.status = 'PUBLISHED') THEN
    
    PERFORM net.http_post(
        url:='https://kahzclgulxnpsnnlfxwd.supabase.co/functions/v1/send-market-alert-email',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
          'trace_id', gen_random_uuid()::text
        ),
        body:=jsonb_build_object(
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA,
          'record', row_to_json(NEW),
          'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE null END
        )
    );
  END IF;
  RETURN NEW;
END;
$$;
