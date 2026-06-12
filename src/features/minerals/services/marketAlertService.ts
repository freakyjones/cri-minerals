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
      .limit(5);

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
  }
};
