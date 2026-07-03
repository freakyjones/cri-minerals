-- Create user_alert_reads table
CREATE TABLE user_alert_reads (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_id UUID NOT NULL REFERENCES market_alerts(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, alert_id)
);

-- Enable Row Level Security
ALTER TABLE user_alert_reads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own read receipts" ON user_alert_reads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own read receipts" ON user_alert_reads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own read receipts" ON user_alert_reads
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can update their own read receipts" ON user_alert_reads
  FOR UPDATE USING (user_id = auth.uid());

-- Create RPC function to efficiently count unread published alerts
CREATE OR REPLACE FUNCTION get_unread_alerts_count()
RETURNS integer
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(*)::integer
  FROM market_alerts ma
  WHERE ma.status = 'PUBLISHED'
    AND NOT EXISTS (
      SELECT 1
      FROM user_alert_reads uar
      WHERE uar.alert_id = ma.id
        AND uar.user_id = auth.uid()
    );
$$;
