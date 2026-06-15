import { createContext, useContext, useState, ReactNode } from 'react';

export type ScenarioType = 'NONE' | 'MALACCA_BLOCKADE' | 'DRC_FREEZE';

interface SimulatorState {
  activeScenario: ScenarioType;
  globalModifiers: {
    freightCostMultiplier: number;
    baseTransitDelay: number;
    mineralPriceSpike: Record<string, number>; // mineral ID -> multiplier
  };
}

interface SimulatorContextType {
  state: SimulatorState;
  setActiveScenario: (scenario: ScenarioType) => void;
}

const defaultState: SimulatorState = {
  activeScenario: 'NONE',
  globalModifiers: {
    freightCostMultiplier: 1.0,
    baseTransitDelay: 0,
    mineralPriceSpike: {}
  }
};

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SimulatorState>(defaultState);

  const setActiveScenario = (scenario: ScenarioType) => {
    switch (scenario) {
      case 'MALACCA_BLOCKADE':
        setState({
          activeScenario: scenario,
          globalModifiers: {
            freightCostMultiplier: 4.5, // 350% spike
            baseTransitDelay: 15, // 15 days
            mineralPriceSpike: {}
          }
        });
        break;
      case 'DRC_FREEZE':
        setState({
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
        setState(defaultState);
        break;
    }
  };

  return (
    <SimulatorContext.Provider value={{ state, setActiveScenario }}>
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) throw new Error('useSimulator must be used within SimulatorProvider');
  return context;
};
