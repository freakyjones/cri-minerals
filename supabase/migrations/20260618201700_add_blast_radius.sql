ALTER TABLE market_alerts 
ADD COLUMN blast_radius JSONB,
ADD COLUMN disruption_multiplier NUMERIC;
