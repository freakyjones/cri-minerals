import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function testFetch() {
  const { data, error } = await supabase
    .from('minerals')
    .select(`
      *,
      mineral_use_cases(label, share),
      mineral_reserves(country, share, amount_mt),
      mineral_production(country, share, amount_mt),
      mineral_refining(country, share),
      mineral_choke_points(title, severity, description, affected_countries),
      mineral_data_sources(label, url),
      mineral_esg_risks(country, category, severity, summary),
      mineral_timeline(year, event, impact)
    `);

  if (error) {
    console.error("Supabase error:", error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log("No data returned! RLS issue?");
    return;
  }

  const dbMineral = data[0];
  console.log("Raw DB output for first mineral:", JSON.stringify(dbMineral, null, 2));

  // Try mapping
  const mapped = {
    ...dbMineral,
    atomicNumber: dbMineral.atomic_number,
    riskScore: dbMineral.risk_score,
    substituteMineral: dbMineral.substitute_mineral ?? undefined,
    recyclingRate: Number(dbMineral.recycling_rate),
    recyclingSources: dbMineral.recycling_sources,
    useCases: (dbMineral.mineral_use_cases || []).map(u => ({ ...u, share: Number(u.share) })),
    reserves: (dbMineral.mineral_reserves || []).map(r => ({
      ...r,
      share: Number(r.share),
      amount_mt: r.amount_mt ? Number(r.amount_mt) : undefined
    })),
    production: (dbMineral.mineral_production || []).map(p => ({
      ...p,
      share: Number(p.share),
      amount_mt: p.amount_mt ? Number(p.amount_mt) : undefined
    })),
    refining: (dbMineral.mineral_refining || []).map(r => ({ ...r, share: Number(r.share) })),
    chokePoints: (dbMineral.mineral_choke_points || []).map(c => ({
      ...c,
      affectedCountries: c.affected_countries
    })),
    dataSources: dbMineral.mineral_data_sources || [],
    esgRisks: dbMineral.mineral_esg_risks?.length ? dbMineral.mineral_esg_risks : undefined,
    timeline: dbMineral.mineral_timeline?.length ? dbMineral.mineral_timeline : undefined
  };

  console.log("Mapped output:", JSON.stringify(mapped, null, 2));
}

testFetch().catch(console.error);
