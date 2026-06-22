import { create } from 'zustand';
import { useMemo } from 'react';

export type DisruptionType = 'CHOKE_POINT_CLOSURE' | 'EXPORT_FREEZE' | 'PRICE_SHOCK' | 'DANGER_ZONE';

export interface DisruptionPayload {
  id: string;
  title: string;
  type: DisruptionType;
  targetNodes?: string[];
  center?: [number, number];
  radiusKm?: number;
  affectedMinerals?: string[];
  multipliers: {
    freightCost: number;
    transitDelay: number;
    priceSpike: number;
  };
}

interface SimulatorStore {
  activeDisruptions: DisruptionPayload[];
  addDisruption: (disruption: DisruptionPayload) => void;
  removeDisruption: (id: string) => void;
}

export const useSimulatorStore = create<SimulatorStore>((set) => ({
  activeDisruptions: [],
  
  addDisruption: (disruption) => set((state) => {
    // Avoid duplicates by ID
    const exists = state.activeDisruptions.find(d => d.id === disruption.id);
    if (exists) return state;
    return { activeDisruptions: [disruption, ...state.activeDisruptions] };
  }),
  
  removeDisruption: (id) => set((state) => ({
    activeDisruptions: state.activeDisruptions.filter((d) => d.id !== id)
  }))
}));

export const useEffectiveModifiers = (activeDisruptions: DisruptionPayload[], mineralName?: string) => {
  
  return useMemo(() => {
    let totalFreight = 1.0;
    let totalDelay = 0;
    const priceSpike: Record<string, number> = {};

    activeDisruptions.forEach(d => {
      // If affectedMinerals is specified, only apply if the current mineral matches
      if (mineralName && d.affectedMinerals && !d.affectedMinerals.includes(mineralName)) {
        return;
      }
      
      totalFreight *= d.multipliers.freightCost;
      totalDelay += d.multipliers.transitDelay;
      
      if (d.multipliers.priceSpike > 1) {
        if (d.affectedMinerals) {
           d.affectedMinerals.forEach(m => {
               priceSpike[m] = (priceSpike[m] || 1) * d.multipliers.priceSpike;
           });
        } else if (mineralName) {
           // Global disruption applies to the currently viewed mineral
           priceSpike[mineralName] = (priceSpike[mineralName] || 1) * d.multipliers.priceSpike;
        }
      }
    });

    return {
      freightCostMultiplier: totalFreight,
      baseTransitDelay: totalDelay,
      mineralPriceSpike: priceSpike
    };
  }, [activeDisruptions, mineralName]);
};
