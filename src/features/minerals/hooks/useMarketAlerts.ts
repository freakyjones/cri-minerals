import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useDraftAlerts() {
  const { data, isLoading, error, refetch: rqRefetch } = useQuery({
    queryKey: ['draftAlerts'],
    queryFn: async ({ signal }) => {
      return await marketAlertService.getDraftAlerts(signal);
    }
  });

  const refetch = () => rqRefetch();

  return { drafts: data || [], loading: isLoading, error: error instanceof Error ? error : error ? new Error(String(error)) : null, refetch };
}

export function usePublishAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => marketAlertService.publishAlert(id),
    onSuccess: () => {
      // Refresh both draft and published lists
      queryClient.invalidateQueries({ queryKey: ['draftAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['marketAlerts'] });
    }
  });
}

export function useRejectAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => marketAlertService.rejectAlert(id),
    onSuccess: () => {
      // Refresh the draft list
      queryClient.invalidateQueries({ queryKey: ['draftAlerts'] });
    }
  });
}
