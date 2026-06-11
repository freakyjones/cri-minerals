import { useState, useEffect } from 'react';
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
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadMinerals = async () => {
      try {
        const data = await fetchMineralsFromDB(abortController.signal);
        
        if (!abortController.signal.aborted && data) {
          const validMinerals = (data as RawMineralDBRecord[])
            .map(parseMineral)
            .filter((m): m is Mineral => m !== null);
            
          setMinerals(validMinerals);
        }
      } catch (err) {
        if (!abortController.signal.aborted) setError(toError(err));
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    loadMinerals();

    return () => abortController.abort();
  }, []);

  return { minerals, loading, error };
}

export function useMineral(slug: string | undefined) {
  // Derive state during render when prop changes (React recommended pattern)
  // Prevents flashing old data and avoids setState-in-useEffect cascading renders
  const [prevSlug, setPrevSlug] = useState(slug);
  const [mineral, setMineral] = useState<Mineral | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<Error | null>(null);

  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setMineral(null);
    setLoading(!!slug);
    setError(null);
  }

  useEffect(() => {
    if (!slug) return;

    const abortController = new AbortController();

    const loadMineral = async () => {
      try {
        const data = await fetchMineralBySlugFromDB(slug, abortController.signal);
        
        if (!abortController.signal.aborted) {
          if (!data) {
            setMineral(null);
            return;
          }

          const validMineral = parseMineral(data as RawMineralDBRecord);
          if (validMineral) {
            setMineral(validMineral);
          } else {
            throw new Error(`Data validation failed for specific mineral: ${slug}`);
          }
        }
      } catch (err) {
        if (!abortController.signal.aborted) setError(toError(err));
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    loadMineral();

    return () => abortController.abort();
  }, [slug]);

  return { mineral, loading, error };
}
