import { Activity, AlertTriangle, Ship, BatteryWarning } from 'lucide-react';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { useSimulator } from '../../simulator/contexts/SimulatorContext';

export type SimulatedEvent = { type: 'CHOKE_POINT' | 'ESG_BAN'; targetId: string } | null;

interface SupplyChainSimulatorProps {
  selectedMineral: Mineral | null;
  simulatedEvent: SimulatedEvent; // Kept for legacy compatibility
  setSimulatedEvent: (event: SimulatedEvent) => void;
}

export default function SupplyChainSimulator({
  selectedMineral
}: SupplyChainSimulatorProps) {
  const { state, setActiveScenario } = useSimulator();
  const { activeScenario, globalModifiers } = state;

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-5 mt-4 rounded-xl shadow-2xl relative overflow-hidden flex flex-col gap-4">
      {/* Background visual element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-blue" />
          What-If Simulator
        </h3>
      </div>

      {!selectedMineral ? (
        <div className="text-sm text-slate-500 italic py-4 relative z-10">
          Select an asset to unlock simulation scenarios.
        </div>
      ) : (
        <div className="space-y-4 relative z-10 flex flex-col">
          
          {/* Malacca Blockade Scenario */}
          <button
            onClick={() => setActiveScenario(activeScenario === 'MALACCA_BLOCKADE' ? 'NONE' : 'MALACCA_BLOCKADE')}
            className={`p-3 rounded-lg border text-left transition-all duration-300 flex flex-col gap-1.5 ${
              activeScenario === 'MALACCA_BLOCKADE' 
                ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <Ship size={16} className={activeScenario === 'MALACCA_BLOCKADE' ? 'text-red-400' : 'text-slate-400'} />
              <span className={`text-sm font-semibold ${activeScenario === 'MALACCA_BLOCKADE' ? 'text-red-400' : 'text-slate-200'}`}>
                Malacca Blockade
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Total closure of the Strait of Malacca, forcing maritime traffic to reroute south, adding significant transit time.
            </p>
          </button>

          {/* DRC Cobalt Freeze Scenario */}
          <button
            onClick={() => setActiveScenario(activeScenario === 'DRC_FREEZE' ? 'NONE' : 'DRC_FREEZE')}
            className={`p-3 rounded-lg border text-left transition-all duration-300 flex flex-col gap-1.5 ${
              activeScenario === 'DRC_FREEZE' 
                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <BatteryWarning size={16} className={activeScenario === 'DRC_FREEZE' ? 'text-amber-400' : 'text-slate-400'} />
              <span className={`text-sm font-semibold ${activeScenario === 'DRC_FREEZE' ? 'text-amber-400' : 'text-slate-200'}`}>
                DRC Cobalt Freeze
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Export freeze on Cobalt from the DRC, triggering a price spike and chemistry pivot to LFP batteries.
            </p>
          </button>

          {/* Dynamic Impact Metrics */}
          {activeScenario !== 'NONE' && (
            <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Simulated Market Impact</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Freight Rate</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-red-400">{globalModifiers.freightCostMultiplier}x</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Transit Delay</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-amber-400">+{globalModifiers.baseTransitDelay}</span>
                    <span className="text-[10px] text-amber-500 font-mono">Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
