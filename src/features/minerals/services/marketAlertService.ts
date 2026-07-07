import { supabase } from '../../../lib/supabase';
import { logger } from '../../../utils/logger';
import { marketAlertSchema, type MarketAlert } from '../schema/marketAlertSchema';

const parseMarketAlert = (row: unknown): MarketAlert | null => {
  const parsed = marketAlertSchema.safeParse(row);
  if (parsed.success) return parsed.data;
  logger.warn(`Validation failed for market alert:`, { error: parsed.error });
  return null;
};

export const marketAlertService = {
  async getPublishedAlerts(abortSignal?: AbortSignal): Promise<MarketAlert[]> {
    let query = supabase
      .from('market_alerts')
      .select('*, user_alert_reads!left(user_id)')
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
      .select('*, user_alert_reads!left(user_id)')
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

  async getAlertById(id: string): Promise<MarketAlert> {
    const { data, error } = await supabase
      .from('market_alerts')
      .select('*, user_alert_reads!left(user_id)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Alert not found");

    const parsed = parseMarketAlert(data);
    if (!parsed) throw new Error("Validation failed for market alert");
    return parsed;
  },

  async markAlertAsRead(alertId: string, userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('user_alert_reads')
      .upsert({ user_id: userId, alert_id: alertId }, { onConflict: 'user_id,alert_id' });
    
    if (error) throw error;
  },

  async getUnreadAlertsCount(): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .rpc('get_unread_alerts_count');
      
    if (error) throw error;
    return (data as number) || 0;
  },

  async triggerAlertsGeneration(): Promise<{ run_id: string }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('generate_market_alerts_status')
      .insert({ status: 'PENDING', triggered_by: 'manual' })
      .select('run_id')
      .single();
    
    if (error) throw error;
    return data as { run_id: string };
  },

  async searchAlerts(queryEmbedding: number[], matchThreshold = 0.5, matchCount = 5): Promise<MarketAlert[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('match_alerts', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) throw error;
    
    if (!data) return [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => parseMarketAlert(a))
      .filter((a): a is MarketAlert => a !== null);
  }
};
