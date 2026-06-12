import { useQuery } from '@tanstack/react-query';
import { marketAlertService } from '../services/marketAlertService';

export function useMarketAlerts() {
  const { data, isLoading, error, refetch: rqRefetch } = useQuery({
    queryKey: ['marketAlerts'],
    queryFn: async ({ signal }) => {
      return await marketAlertService.getPublishedAlerts(signal);
    }
  });

  const refetch = () => rqRefetch();

  return { alerts: data || [], loading: isLoading, error: error instanceof Error ? error : error ? new Error(String(error)) : null, refetch };
}
