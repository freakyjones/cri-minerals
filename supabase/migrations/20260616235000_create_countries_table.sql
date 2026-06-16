-- Create compliance status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'compliance_status_type') THEN
        CREATE TYPE compliance_status_type AS ENUM ('FEOC', 'FTA', 'NEUTRAL');
    END IF;
END$$;

-- Create countries table
CREATE TABLE IF NOT EXISTS public.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    iso_code VARCHAR(2) UNIQUE NOT NULL,
    compliance_status compliance_status_type DEFAULT 'NEUTRAL',
    compliance_tags TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'countries' AND policyname = 'Allow public read access on countries'
    ) THEN
        CREATE POLICY "Allow public read access on countries"
            ON public.countries FOR SELECT
            USING (true);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'countries' AND policyname = 'Allow admin updates on countries'
    ) THEN
        CREATE POLICY "Allow admin updates on countries"
            ON public.countries FOR ALL
            USING (auth.jwt() ->> 'role' = 'admin');
    END IF;
END$$;

-- Seed initial data matching existing hardcoded FEOC and FTA countries
INSERT INTO public.countries (name, iso_code, compliance_status, compliance_tags) VALUES
    ('China', 'CN', 'FEOC', ARRAY['Sanctioned Entity', 'State-Backed Enterprise Risk']),
    ('Russia', 'RU', 'FEOC', ARRAY['Sanctioned Entity', 'Conflict Region', 'High ESG Risk']),
    ('Iran', 'IR', 'FEOC', ARRAY['Sanctioned Entity', 'High ESG Risk']),
    ('North Korea', 'KP', 'FEOC', ARRAY['Sanctioned Entity']),
    
    ('Australia', 'AU', 'FTA', ARRAY['IRMA Certified']),
    ('Canada', 'CA', 'FTA', ARRAY['IRMA Certified']),
    ('Chile', 'CL', 'FTA', ARRAY[]::TEXT[]),
    ('Mexico', 'MX', 'FTA', ARRAY[]::TEXT[]),
    ('South Korea', 'KR', 'FTA', ARRAY[]::TEXT[]),
    ('Japan', 'JP', 'FTA', ARRAY[]::TEXT[]),
    ('Morocco', 'MA', 'FTA', ARRAY[]::TEXT[]),
    
    ('Democratic Republic of Congo', 'CD', 'NEUTRAL', ARRAY['High ESG Risk', 'Conflict Region', 'Child Labor Concerns']),
    ('Indonesia', 'ID', 'NEUTRAL', ARRAY['High ESG Risk', 'Environmental Degradation Risk']),
    ('Argentina', 'AR', 'NEUTRAL', ARRAY[]::TEXT[])
ON CONFLICT (iso_code) DO NOTHING;
