import { useState } from 'react';
import mineralsDataRaw from '../data/minerals.json';
import { mineralsArraySchema, mineralSchema } from '../schema/mineralSchema';
import type { Mineral } from '../schema/mineralSchema';

// Parse and cache the data globally so it's instantly available and only parsed once
let cachedMinerals: Mineral[] | null = null;

export function useMinerals() {
  const [minerals] = useState<Mineral[]>(() => {
    if (cachedMinerals) return cachedMinerals;
    try {
      cachedMinerals = mineralsArraySchema.parse(mineralsDataRaw);
      return cachedMinerals;
    } catch {
      return [];
    }
  });

  // Loading is permanently false because data is local and instant
  return { minerals, loading: false, error: null };
}

export function useMineral(slug: string | undefined) {
  const [mineral] = useState<Mineral | null>(() => {
    if (!slug) return null;
    
    // Use cache if available
    const dataList = cachedMinerals || mineralsDataRaw;
    
    try {
      const found = dataList.find((m: { slug?: string }) => m.slug === slug);
      if (found) {
        return mineralSchema.parse(found);
      }
      return null;
    } catch {
      return null;
    }
  });

  return { mineral, loading: false, error: null };
}
