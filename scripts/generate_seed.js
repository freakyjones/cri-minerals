import fs from 'fs';
import { randomUUID } from 'crypto';

const data = JSON.parse(fs.readFileSync('src/data/minerals.json', 'utf8'));

let sql = '';
const escape = (str) => {
  if (str == null) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
};
const escNum = (num) => (num == null ? 'NULL' : num);
const escArray = (arr) => {
  if (!arr || arr.length === 0) return "'{}'";
  const escapedItems = arr.map(item => `"${item.replace(/"/g, '\\""')}"`);
  return `'{${escapedItems.join(',')}}'`;
};

for (const m of data) {
  const mId = randomUUID();
  sql += `INSERT INTO minerals (id, slug, name, symbol, atomic_number, category, tagline, risk_score, color, substitutability, substitute_mineral, recycling_rate, recycling_sources) VALUES ('${mId}', ${escape(m.slug)}, ${escape(m.name)}, ${escape(m.symbol)}, ${m.atomicNumber}, ${escape(m.category)}, ${escape(m.tagline)}, ${escape(m.riskScore)}, ${escape(m.color)}, ${escape(m.substitutability)}, ${escape(m.substituteMineral)}, ${m.recyclingRate}, ${escArray(m.recyclingSources)});\n`;

  if (m.useCases) {
    for (const u of m.useCases) {
      sql += `INSERT INTO mineral_use_cases (mineral_id, label, share) VALUES ('${mId}', ${escape(u.label)}, ${u.share});\n`;
    }
  }
  if (m.reserves) {
    for (const r of m.reserves) {
      sql += `INSERT INTO mineral_reserves (mineral_id, country, share, amount_mt) VALUES ('${mId}', ${escape(r.country)}, ${r.share}, ${escNum(r.amount_mt)});\n`;
    }
  }
  if (m.production) {
    for (const p of m.production) {
      sql += `INSERT INTO mineral_production (mineral_id, country, share, amount_mt) VALUES ('${mId}', ${escape(p.country)}, ${p.share}, ${escNum(p.amount_mt)});\n`;
    }
  }
  if (m.refining) {
    for (const r of m.refining) {
      sql += `INSERT INTO mineral_refining (mineral_id, country, share) VALUES ('${mId}', ${escape(r.country)}, ${r.share});\n`;
    }
  }
  if (m.chokePoints) {
    for (const c of m.chokePoints) {
      sql += `INSERT INTO mineral_choke_points (mineral_id, title, severity, description, affected_countries) VALUES ('${mId}', ${escape(c.title)}, ${escape(c.severity)}, ${escape(c.description)}, ${escArray(c.affectedCountries)});\n`;
    }
  }
  if (m.dataSources) {
    for (const d of m.dataSources) {
      sql += `INSERT INTO mineral_data_sources (mineral_id, label, url) VALUES ('${mId}', ${escape(d.label)}, ${escape(d.url)});\n`;
    }
  }
  if (m.esgRisks) {
    for (const e of m.esgRisks) {
      sql += `INSERT INTO mineral_esg_risks (mineral_id, country, category, severity, summary) VALUES ('${mId}', ${escape(e.country)}, ${escape(e.category)}, ${escape(e.severity)}, ${escape(e.summary)});\n`;
    }
  }
  if (m.timeline) {
    for (const t of m.timeline) {
      sql += `INSERT INTO mineral_timeline (mineral_id, year, event, impact) VALUES ('${mId}', ${t.year}, ${escape(t.event)}, ${escape(t.impact)});\n`;
    }
  }
}

fs.writeFileSync('scripts/seed.sql', sql);
