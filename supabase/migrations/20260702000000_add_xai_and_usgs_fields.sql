-- 1. Add XAI (Explainability) fields to market_alerts
ALTER TABLE public.market_alerts
ADD COLUMN confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
ADD COLUMN rationale TEXT[];

-- 2. Add USGS geological tracking fields to minerals
ALTER TABLE public.minerals
ADD COLUMN global_reserves_mt NUMERIC,
ADD COLUMN annual_production_mt NUMERIC,
ADD COLUMN last_usgs_sync TIMESTAMPTZ;
