import { supabase } from '../../../lib/supabase';
import { useQuery } from '@tanstack/react-query';

export interface AlertQueueStatus {
  run_id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'TIMEOUT';
  error_message?: string;
  created_at: string;
}

export function useAlertQueue(runId: string | null) {
  const fetchStatus = async () => {
    if (!runId) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('generate_market_alerts_status')
      .select('*')
      .eq('run_id', runId)
      .single();
      
    if (error) throw error;
    return data as AlertQueueStatus;
  };

  const { data: status } = useQuery({
    queryKey: ['alertQueue', runId],
    queryFn: fetchStatus,
    enabled: !!runId,
    // Poll every 2 seconds while the job is running
    refetchInterval: (query) => {
      const currentStatus = query.state.data?.status;
      if (currentStatus === 'COMPLETED' || currentStatus === 'FAILED' || currentStatus === 'TIMEOUT') {
        return false; // Stop polling when terminal state reached
      }
      return 2000;
    },
    // Don't discard data while polling
    staleTime: 0,
  });

  return status ?? null;
}
