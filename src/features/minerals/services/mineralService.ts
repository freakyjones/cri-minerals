import { supabase } from '../../../lib/supabase';
import { logger } from '../../../utils/logger';
import { mineralSchema, type Mineral } from '../schema/mineralSchema';

interface RawMineralDBRecord {
  id?: string;
  slug?: string;
  atomic_number?: number;
  risk_score?: string;
  substitute_mineral?: string | null;
  recycling_rate?: number | string;
  current_price_usd?: number | string;
  recycling_sources?: string[];
  mineral_use_cases?: Array<{ label: string; share: number | string }>;
  mineral_reserves?: Array<{ country: string; share: number | string; amount_mt?: number | string | null }>;
  mineral_production?: Array<{ country: string; share: number | string; amount_mt?: number | string | null }>;
  mineral_refining?: Array<{ country: string; share: number | string }>;
  mineral_choke_points?: Array<{ title: string; severity: string; description: string; affected_countries: string[] }>;
  mineral_data_sources?: Array<{ label: string; url: string }>;
  mineral_esg_risks?: Array<{ country: string; category: string; severity: string; summary: string }>;
  mineral_timeline?: Array<{ year: number; event: string; impact: string }>;
  [key: string]: unknown;
}

const mapMineralFromDB = (dbMineral: RawMineralDBRecord): unknown => {
  return {
    ...dbMineral,
    atomicNumber: dbMineral.atomic_number,
    riskScore: dbMineral.risk_score,
    substituteMineral: dbMineral.substitute_mineral ?? undefined,
    recyclingRate: Number(dbMineral.recycling_rate),
    currentPriceUsd: dbMineral.current_price_usd ? Number(dbMineral.current_price_usd) : undefined,
    recyclingSources: dbMineral.recycling_sources,
    useCases: (dbMineral.mineral_use_cases || []).map((u) => ({ ...u, share: Number(u.share) })),
    reserves: (dbMineral.mineral_reserves || []).map((r) => ({
      ...r,
      share: Number(r.share),
      amount_mt: r.amount_mt ? Number(r.amount_mt) : undefined
    })),
    production: (dbMineral.mineral_production || []).map((p) => ({
      ...p,
      share: Number(p.share),
      amount_mt: p.amount_mt ? Number(p.amount_mt) : undefined
    })),
    refining: (dbMineral.mineral_refining || []).map((r) => ({ ...r, share: Number(r.share) })),
    chokePoints: (dbMineral.mineral_choke_points || []).map((c) => ({
      ...c,
      affectedCountries: c.affected_countries
    })),
    dataSources: dbMineral.mineral_data_sources || [],
    esgRisks: dbMineral.mineral_esg_risks?.length ? dbMineral.mineral_esg_risks : undefined,
    timeline: dbMineral.mineral_timeline?.length ? dbMineral.mineral_timeline : undefined
  };
};

const parseMineral = (row: RawMineralDBRecord): Mineral | null => {
  const mapped = mapMineralFromDB(row);
  const parsed = mineralSchema.safeParse(mapped);
  
  if (parsed.success) return parsed.data;
  
  logger.warn(`Validation failed for mineral ${row.slug ?? row.id}:`, { error: parsed.error });
  return null;
};

const MINERAL_LIST_SELECT_QUERY = `
  id,
  slug,
  name,
  symbol,
  atomic_number,
  category,
  risk_score,
  color,
  tagline,
  substitutability,
  recycling_rate,
  current_price_usd,
  recycling_sources,
  mineral_reserves(country, share, amount_mt),
  mineral_production(country, share, amount_mt),
  mineral_refining(country, share)
`;

const MINERAL_DETAIL_SELECT_QUERY = `
  *,
  mineral_use_cases(label, share),
  mineral_reserves(country, share, amount_mt),
  mineral_production(country, share, amount_mt),
  mineral_refining(country, share),
  mineral_choke_points(title, severity, description, affected_countries),
  mineral_data_sources(label, url),
  mineral_esg_risks(country, category, severity, summary),
  mineral_timeline(year, event, impact)
`;

export const mineralService = {
  async getMinerals(abortSignal?: AbortSignal): Promise<Mineral[]> {
    let query = supabase.from('minerals').select(MINERAL_LIST_SELECT_QUERY);
    if (abortSignal) {
      query = query.abortSignal(abortSignal);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    if (!data) return [];
    
    return (data as RawMineralDBRecord[])
      .map(parseMineral)
      .filter((m): m is Mineral => m !== null);
  },

  async getMineralBySlug(slug: string, abortSignal?: AbortSignal): Promise<Mineral | null> {
    let query = supabase
      .from('minerals')
      .select(MINERAL_DETAIL_SELECT_QUERY)
      .eq('slug', slug);
      
    if (abortSignal) {
      query = query.abortSignal(abortSignal);
    }
    
    const { data, error } = await query.single();
    if (error) throw error;
    
    if (!data) return null;
    
    const validMineral = parseMineral(data as RawMineralDBRecord);
    if (!validMineral) {
      throw new Error(`Data validation failed for specific mineral: ${slug}`);
    }
    
    return validMineral;
  }
};
