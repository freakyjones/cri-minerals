-- Migration 0002: Performance & Security Hardening

-- 1. Create indexes on all foreign keys to prevent sequential scans during joins
CREATE INDEX IF NOT EXISTS idx_mineral_use_cases_mineral_id ON mineral_use_cases(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_reserves_mineral_id ON mineral_reserves(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_production_mineral_id ON mineral_production(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_refining_mineral_id ON mineral_refining(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_choke_points_mineral_id ON mineral_choke_points(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_data_sources_mineral_id ON mineral_data_sources(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_esg_risks_mineral_id ON mineral_esg_risks(mineral_id);
CREATE INDEX IF NOT EXISTS idx_mineral_timeline_mineral_id ON mineral_timeline(mineral_id);

-- 2. Harden RLS Policies (Principle of Least Privilege)
-- Drop the overly permissive public policies
DROP POLICY IF EXISTS "Enable public read access for minerals" ON minerals;
DROP POLICY IF EXISTS "Enable public read access for mineral_use_cases" ON mineral_use_cases;
DROP POLICY IF EXISTS "Enable public read access for mineral_reserves" ON mineral_reserves;
DROP POLICY IF EXISTS "Enable public read access for mineral_production" ON mineral_production;
DROP POLICY IF EXISTS "Enable public read access for mineral_refining" ON mineral_refining;
DROP POLICY IF EXISTS "Enable public read access for mineral_choke_points" ON mineral_choke_points;
DROP POLICY IF EXISTS "Enable public read access for mineral_data_sources" ON mineral_data_sources;
DROP POLICY IF EXISTS "Enable public read access for mineral_esg_risks" ON mineral_esg_risks;
DROP POLICY IF EXISTS "Enable public read access for mineral_timeline" ON mineral_timeline;

-- Create restricted policies explicitly for the `anon` and `authenticated` roles
CREATE POLICY "Enable read access for anon and authenticated" ON minerals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_use_cases FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_reserves FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_production FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_refining FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_choke_points FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_data_sources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_esg_risks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Enable read access for anon and authenticated" ON mineral_timeline FOR SELECT TO anon, authenticated USING (true);
