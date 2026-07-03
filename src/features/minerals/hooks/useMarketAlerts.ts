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

export function useTriggerAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => marketAlertService.triggerAlertsGeneration(),
    onSuccess: () => {
      // Refresh the draft list after generating new ones
      queryClient.invalidateQueries({ queryKey: ['draftAlerts'] });
    }
  });
}

import { supabase } from '../../../lib/supabase';

export function useSemanticSearch() {
  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!searchTerm.trim()) return null;

      const { data: embedData, error: embedError } = await supabase.functions.invoke('search-embedding', {
        body: { query: searchTerm }
      });

      if (embedError) {
        console.error("Supabase invoke error:", embedError);
        throw new Error(embedError.message || "Failed to connect to edge function");
      }
      
      if (embedData?.error) {
        throw new Error(embedData.error);
      }

      if (!embedData?.embedding) {
        throw new Error("No embedding returned from AI service");
      }

      return await marketAlertService.searchAlerts(embedData.embedding, 0.4, 20);
    }
  });
}

export function useMarketAlert(id: string) {
  return useQuery({
    queryKey: ['marketAlert', id],
    queryFn: () => marketAlertService.getAlertById(id),
    enabled: !!id,
  });
}

export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ alertId, userId }: { alertId: string; userId: string }) => 
      marketAlertService.markAlertAsRead(alertId, userId),
    onSuccess: () => {
      // Refresh the lists and the unread count when an alert is marked as read
      queryClient.invalidateQueries({ queryKey: ['marketAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['unreadAlertsCount'] });
      // We could also do optimistic updates here
    }
  });
}

export function useUnreadAlertsCount() {
  return useQuery({
    queryKey: ['unreadAlertsCount'],
    queryFn: () => marketAlertService.getUnreadAlertsCount(),
    // Keep it relatively fresh
    staleTime: 60000,
  });
}
