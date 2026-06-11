import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const envFile = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
const data = JSON.parse(fs.readFileSync('src/data/minerals.json', 'utf8'));

async function seed() {
  for (const m of data) {
    const mId = randomUUID();
    console.log(`Inserting ${m.name}...`);
    
    // 1. Mineral
    const { error: err1 } = await supabase.from('minerals').insert({
      id: mId,
      slug: m.slug,
      name: m.name,
      symbol: m.symbol,
      atomic_number: m.atomicNumber,
      category: m.category,
      tagline: m.tagline,
      risk_score: m.riskScore,
      color: m.color,
      substitutability: m.substitutability,
      substitute_mineral: m.substituteMineral,
      recycling_rate: m.recyclingRate,
      recycling_sources: m.recyclingSources
    });
    if (err1) { console.error('Error mineral:', err1); continue; }

    // 2. Use Cases
    if (m.useCases) {
      await supabase.from('mineral_use_cases').insert(
        m.useCases.map(u => ({ mineral_id: mId, label: u.label, share: u.share }))
      );
    }
    
    // 3. Reserves
    if (m.reserves) {
      await supabase.from('mineral_reserves').insert(
        m.reserves.map(r => ({ mineral_id: mId, country: r.country, share: r.share, amount_mt: r.amount_mt }))
      );
    }

    // 4. Production
    if (m.production) {
      await supabase.from('mineral_production').insert(
        m.production.map(p => ({ mineral_id: mId, country: p.country, share: p.share, amount_mt: p.amount_mt }))
      );
    }

    // 5. Refining
    if (m.refining) {
      await supabase.from('mineral_refining').insert(
        m.refining.map(r => ({ mineral_id: mId, country: r.country, share: r.share }))
      );
    }

    // 6. Choke points
    if (m.chokePoints) {
      await supabase.from('mineral_choke_points').insert(
        m.chokePoints.map(c => ({ mineral_id: mId, title: c.title, severity: c.severity, description: c.description, affected_countries: c.affectedCountries }))
      );
    }

    // 7. Data sources
    if (m.dataSources) {
      await supabase.from('mineral_data_sources').insert(
        m.dataSources.map(d => ({ mineral_id: mId, label: d.label, url: d.url }))
      );
    }

    // 8. ESG risks
    if (m.esgRisks) {
      await supabase.from('mineral_esg_risks').insert(
        m.esgRisks.map(e => ({ mineral_id: mId, country: e.country, category: e.category, severity: e.severity, summary: e.summary }))
      );
    }

    // 9. Timeline
    if (m.timeline) {
      await supabase.from('mineral_timeline').insert(
        m.timeline.map(t => ({ mineral_id: mId, year: t.year, event: t.event, impact: t.impact }))
      );
    }
  }
  console.log('Seeding completed!');
}

seed().catch(console.error);
