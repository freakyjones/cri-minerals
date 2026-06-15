import { create } from 'zustand';

export type ScenarioType = 'NONE' | 'MALACCA_BLOCKADE' | 'DRC_FREEZE';

interface SimulatorState {
  activeScenario: ScenarioType;
  globalModifiers: {
    freightCostMultiplier: number;
    baseTransitDelay: number;
    mineralPriceSpike: Record<string, number>; // mineral ID -> multiplier
  };
  setActiveScenario: (scenario: ScenarioType) => void;
}

const defaultModifiers = {
  freightCostMultiplier: 1.0,
  baseTransitDelay: 0,
  mineralPriceSpike: {}
};

export const useSimulatorStore = create<SimulatorState>((set) => ({
  activeScenario: 'NONE',
  globalModifiers: defaultModifiers,
  setActiveScenario: (scenario: ScenarioType) => {
    switch (scenario) {
      case 'MALACCA_BLOCKADE':
        set({
          activeScenario: scenario,
          globalModifiers: {
            freightCostMultiplier: 4.5, // 350% spike
            baseTransitDelay: 15, // 15 days
            mineralPriceSpike: {}
          }
        });
        break;
      case 'DRC_FREEZE':
        set({
          activeScenario: scenario,
          globalModifiers: {
            freightCostMultiplier: 1.2,
            baseTransitDelay: 0,
            mineralPriceSpike: {
              'Cobalt': 3.5, // 250% spike
              'Lithium': 1.8 // Demand shifts to LFP
            }
          }
        });
        break;
      case 'NONE':
      default:
        set({
          activeScenario: 'NONE',
          globalModifiers: defaultModifiers
        });
        break;
    }
  }
}));
