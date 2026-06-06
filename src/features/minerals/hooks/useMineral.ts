import { useState, useEffect } from 'react';
import mineralsDataRaw from '../data/minerals.json';
import { mineralsArraySchema, mineralSchema } from '../schema/mineralSchema';
import type { Mineral } from '../schema/mineralSchema';

export function useMinerals() {
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      try {
        const validatedData = mineralsArraySchema.parse(mineralsDataRaw);
        setMinerals(validatedData);
      } catch (err) {
        console.error("Data validation failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { minerals, loading, error };
}

export function useMineral(slug: string | undefined) {
  const [mineral, setMineral] = useState<Mineral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    const timer = setTimeout(() => {
      try {
        const found = mineralsDataRaw.find((m) => m.slug === slug);
        if (found) {
          const validatedMineral = mineralSchema.parse(found);
          setMineral(validatedMineral);
        } else {
          setMineral(null);
        }
      } catch (err) {
        console.error("Data validation failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [slug]);

  return { mineral, loading, error };
}
