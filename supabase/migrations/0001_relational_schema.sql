-- Create core minerals table
CREATE TABLE minerals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    atomic_number INTEGER NOT NULL,
    category TEXT NOT NULL,
    tagline TEXT NOT NULL,
    risk_score TEXT NOT NULL,
    color TEXT NOT NULL,
    substitutability TEXT NOT NULL,
    substitute_mineral TEXT,
    recycling_rate NUMERIC NOT NULL,
    recycling_sources TEXT[] NOT NULL
);

-- Enable RLS and public read access
ALTER TABLE minerals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for minerals" ON minerals FOR SELECT USING (true);

-- Create use cases table
CREATE TABLE mineral_use_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    share NUMERIC NOT NULL
);
ALTER TABLE mineral_use_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_use_cases" ON mineral_use_cases FOR SELECT USING (true);

-- Create reserves table
CREATE TABLE mineral_reserves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    share NUMERIC NOT NULL,
    amount_mt NUMERIC
);
ALTER TABLE mineral_reserves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_reserves" ON mineral_reserves FOR SELECT USING (true);

-- Create production table
CREATE TABLE mineral_production (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    share NUMERIC NOT NULL,
    amount_mt NUMERIC
);
ALTER TABLE mineral_production ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_production" ON mineral_production FOR SELECT USING (true);

-- Create refining table
CREATE TABLE mineral_refining (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    share NUMERIC NOT NULL
);
ALTER TABLE mineral_refining ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_refining" ON mineral_refining FOR SELECT USING (true);

-- Create choke points table
CREATE TABLE mineral_choke_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT NOT NULL,
    affected_countries TEXT[] NOT NULL
);
ALTER TABLE mineral_choke_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_choke_points" ON mineral_choke_points FOR SELECT USING (true);

-- Create data sources table
CREATE TABLE mineral_data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL
);
ALTER TABLE mineral_data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_data_sources" ON mineral_data_sources FOR SELECT USING (true);

-- Create ESG risks table
CREATE TABLE mineral_esg_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    summary TEXT NOT NULL
);
ALTER TABLE mineral_esg_risks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_esg_risks" ON mineral_esg_risks FOR SELECT USING (true);

-- Create timeline table
CREATE TABLE mineral_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mineral_id UUID NOT NULL REFERENCES minerals(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    event TEXT NOT NULL,
    impact TEXT NOT NULL
);
ALTER TABLE mineral_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access for mineral_timeline" ON mineral_timeline FOR SELECT USING (true);
