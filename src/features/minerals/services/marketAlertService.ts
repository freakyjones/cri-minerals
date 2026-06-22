import { supabase } from '../../../lib/supabase';
import { marketAlertSchema, type MarketAlert } from '../schema/marketAlertSchema';

const parseMarketAlert = (row: unknown): MarketAlert | null => {
  const parsed = marketAlertSchema.safeParse(row);
  if (parsed.success) return parsed.data;
  console.warn(`Validation failed for market alert:`, parsed.error);
  return null;
};

export const marketAlertService = {
  async getPublishedAlerts(abortSignal?: AbortSignal): Promise<MarketAlert[]> {
    let query = supabase
      .from('market_alerts')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(50);

    if (abortSignal) {
      query = query.abortSignal(abortSignal);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data) return [];
    
    return data
      .map(parseMarketAlert)
      .filter((a): a is MarketAlert => a !== null);
  },

  async getDraftAlerts(abortSignal?: AbortSignal): Promise<MarketAlert[]> {
    let query = supabase
      .from('market_alerts')
      .select('*')
      .eq('status', 'DRAFT')
      .order('created_at', { ascending: false });

    if (abortSignal) {
      query = query.abortSignal(abortSignal);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data) return [];
    
    return data
      .map(parseMarketAlert)
      .filter((a): a is MarketAlert => a !== null);
  },

  async publishAlert(id: string) {
    const { error } = await supabase
      .from('market_alerts')
      .update({ status: 'PUBLISHED' })
      .eq('id', id);
      
    if (error) throw error;
  },

  async rejectAlert(id: string) {
    const { error } = await supabase
      .from('market_alerts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async triggerAlertsGeneration() {
    const { data, error } = await supabase.functions.invoke('generate-market-alerts', {
      method: 'POST',
    });
    
    if (error) throw error;
    return data;
  },

  async searchAlerts(queryEmbedding: number[], matchThreshold = 0.5, matchCount = 5): Promise<MarketAlert[]> {
    const { data, error } = await (supabase as any).rpc('match_alerts', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) throw error;
    
    if (!data) return [];
    
    return (data as any[])
      .map((a: any) => parseMarketAlert(a))
      .filter((a): a is MarketAlert => a !== null);
  }
};
