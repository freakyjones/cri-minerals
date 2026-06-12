import { useQuery } from '@tanstack/react-query';
import { fetchMarketAlertsFromDB } from '../../../services/api';
import { marketAlertSchema, type MarketAlert } from '../schema/marketAlertSchema';

const parseMarketAlert = (row: unknown): MarketAlert | null => {
  const parsed = marketAlertSchema.safeParse(row);
  if (parsed.success) return parsed.data;
  console.warn(`Validation failed for market alert:`, parsed.error);
  return null;
};

export function useMarketAlerts() {
  const { data, isLoading, error, refetch: rqRefetch } = useQuery({
    queryKey: ['marketAlerts'],
    queryFn: async ({ signal }) => {
      const dbData = await fetchMarketAlertsFromDB(signal);
      if (!dbData) return [];
      
      return dbData
        .map(parseMarketAlert)
        .filter((a): a is MarketAlert => a !== null);
    }
  });

  const refetch = () => rqRefetch();

  return { alerts: data || [], loading: isLoading, error: error instanceof Error ? error : error ? new Error(String(error)) : null, refetch };
}
