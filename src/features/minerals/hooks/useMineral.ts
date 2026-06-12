import { useQuery } from '@tanstack/react-query';
import { fetchMineralsFromDB, fetchMineralBySlugFromDB, mapMineralFromDB, RawMineralDBRecord } from '../../../services/api';
import { mineralSchema } from '../schema/mineralSchema';
import type { Mineral } from '../schema/mineralSchema';

// --- Utility Functions ---

const toError = (err: unknown): Error => 
  err instanceof Error ? err : new Error(String(err));

const parseMineral = (row: RawMineralDBRecord): Mineral | null => {
  const mapped = mapMineralFromDB(row);
  const parsed = mineralSchema.safeParse(mapped);
  
  if (parsed.success) return parsed.data;
  
  console.warn(`Validation failed for mineral ${row.slug || row.id}:`, parsed.error);
  return null;
};

// --- Hooks ---

export function useMinerals() {
  const { data, isLoading, error, refetch: rqRefetch } = useQuery({
    queryKey: ['minerals'],
    queryFn: async ({ signal }) => {
      const dbData = await fetchMineralsFromDB(signal);
      if (!dbData) return [];
      
      return (dbData as RawMineralDBRecord[])
        .map(parseMineral)
        .filter((m): m is Mineral => m !== null);
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
      const dbData = await fetchMineralBySlugFromDB(slug, signal);
      if (!dbData) return null;

      const validMineral = parseMineral(dbData as RawMineralDBRecord);
      if (!validMineral) {
        throw new Error(`Data validation failed for specific mineral: ${slug}`);
      }
      return validMineral;
    },
    enabled: !!slug
  });

  const refetch = () => rqRefetch();

  // If slug is missing, we consider it not loading and no mineral.
  const loading = !!slug && isLoading;

  return { mineral: data || null, loading, error: error ? toError(error) : null, refetch };
}
