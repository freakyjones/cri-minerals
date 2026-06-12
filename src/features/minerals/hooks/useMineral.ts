import { useQuery } from '@tanstack/react-query';
import { mineralService } from '../services/mineralService';

const toError = (err: unknown): Error => 
  err instanceof Error ? err : new Error(String(err));

export function useMinerals() {
  const { data, isLoading, error, refetch: rqRefetch } = useQuery({
    queryKey: ['minerals'],
    queryFn: async ({ signal }) => {
      return await mineralService.getMinerals(signal);
    }
  });

  const refetch = () => rqRefetch();

  return { minerals: data || [], loading: isLoading, error: error ? toError(error) : null, refetch };
}

export function useMineral(slug: string | undefined) {
  const { data, isLoading, error, refetch: rqRefetch } = useQuery({
    queryKey: ['mineral', slug],
    queryFn: async ({ signal }) => {
      if (!slug) return null;
      return await mineralService.getMineralBySlug(slug, signal);
    },
    enabled: !!slug
  });

  const refetch = () => rqRefetch();

  const loading = !!slug && isLoading;

  return { mineral: data || null, loading, error: error ? toError(error) : null, refetch };
}
