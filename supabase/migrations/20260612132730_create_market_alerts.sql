-- Create enum types for market alerts
CREATE TYPE severity_level AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
CREATE TYPE alert_status AS ENUM ('DRAFT', 'PUBLISHED');

-- Create market_alerts table
CREATE TABLE market_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity severity_level NOT NULL,
  status alert_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE market_alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to PUBLISHED alerts
CREATE POLICY "Allow public read access for published alerts" ON market_alerts
  FOR SELECT USING (status = 'PUBLISHED');

-- Seed mock data (published alerts)
INSERT INTO market_alerts (title, description, severity, status, created_at)
VALUES 
  ('Tungsten Export Controls', 'China imposes immediate export limits on tungsten compounds. Expect price volatility.', 'CRITICAL', 'PUBLISHED', NOW() - INTERVAL '1 hour'),
  ('Indonesian Nickel Policy', 'New environmental regulations may slow down smelter expansions in Q3.', 'HIGH', 'PUBLISHED', NOW() - INTERVAL '2 days'),
  ('Copper Strike Warning', 'Union negotiations at Escondida mine stall. 30% probability of disruption.', 'MEDIUM', 'PUBLISHED', NOW() - INTERVAL '4 days');

-- Seed a mock draft alert (so an analyst could review it later)
INSERT INTO market_alerts (title, description, severity, status, created_at)
VALUES 
  ('Lithium Overstock', 'European EV sales decline leaves an overstock of processed lithium in ports.', 'LOW', 'DRAFT', NOW());
