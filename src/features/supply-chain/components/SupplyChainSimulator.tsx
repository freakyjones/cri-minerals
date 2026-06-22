import { useState } from 'react';
import { Activity, Ship, BatteryWarning, AlertTriangle, X, Plus, Zap } from 'lucide-react';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { useSimulatorStore, DisruptionPayload, useEffectiveModifiers } from '../../../stores/useSimulatorStore';
import { useMarketAlerts } from '../../minerals/hooks/useMarketAlerts';

export type SimulatedEvent = { type: 'CHOKE_POINT' | 'ESG_BAN'; targetId: string } | null;

interface SupplyChainSimulatorProps {
  selectedMineral: Mineral | null;
  simulatedEvent: SimulatedEvent; // Kept for legacy compatibility
  setSimulatedEvent: (event: SimulatedEvent) => void;
}

const PRESET_DISRUPTIONS: DisruptionPayload[] = [
  {
    id: 'MALACCA_BLOCKADE',
    title: 'Malacca Blockade',
    type: 'CHOKE_POINT_CLOSURE',
    targetNodes: ['Malacca'],
    multipliers: { freightCost: 4.5, transitDelay: 15, priceSpike: 1 }
  },
  {
    id: 'DRC_FREEZE',
    title: 'DRC Cobalt Freeze',
    type: 'EXPORT_FREEZE',
    targetNodes: ['Democratic Republic of the Congo'],
    affectedMinerals: ['Cobalt', 'Lithium'],
    multipliers: { freightCost: 1.2, transitDelay: 0, priceSpike: 3.5 }
  }
];

export default function SupplyChainSimulator({
  selectedMineral
}: SupplyChainSimulatorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'active'>('presets');
  const { addDisruption, removeDisruption } = useSimulatorStore();
  const activeDisruptions = useSimulatorStore(state => state.activeDisruptions);
  const globalModifiers = useEffectiveModifiers(activeDisruptions, selectedMineral?.name);
  const { alerts } = useMarketAlerts();

  const availableAiAlerts = alerts.filter(alert => {
    if (alert.status !== 'PUBLISHED') return false;
    if (!alert.blast_radius) return false;
    if (!alert.affected_minerals || alert.affected_minerals.length === 0) return false;
    if (selectedMineral && !alert.affected_minerals.includes(selectedMineral.name)) return false;
    if (activeDisruptions.find(d => d.id === alert.id)) return false;
    return true;
  });

  const togglePreset = (preset: DisruptionPayload) => {
    if (activeDisruptions.find(d => d.id === preset.id)) {
      removeDisruption(preset.id);
    } else {
      addDisruption(preset);
    }
  };

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-5 mt-4 rounded-xl shadow-2xl relative flex flex-col gap-4">
      {/* Background visual element wrapper */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex items-center justify-between mb-2 relative z-50">
        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-blue" />
          What-If Simulator
        </h3>

        {selectedMineral && (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors border border-accent-blue/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
            >
              <Plus size={14} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-700 bg-slate-900/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available AI Scenarios</span>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {availableAiAlerts.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500 italic text-center">No available scenarios for this mineral.</div>
                  ) : (
                    availableAiAlerts.map(alert => (
                      <button
                        key={alert.id}
                        onClick={() => {
                          addDisruption({
                            id: alert.id,
                            title: alert.title,
                            type: 'DANGER_ZONE',
                            center: [alert.blast_radius!.lat, alert.blast_radius!.lng],
                            radiusKm: alert.blast_radius!.radius,
                            multipliers: {
                              freightCost: alert.disruption_multiplier || 1.5,
                              transitDelay: 5,
                              priceSpike: alert.disruption_multiplier || 1.2
                            },
                            affectedMinerals: alert.affected_minerals || undefined
                          });
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0 flex items-start gap-3 group"
                      >
                        <AlertTriangle size={14} className="text-purple-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-slate-200 line-clamp-2 leading-relaxed flex-1 min-w-0">{alert.title}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!selectedMineral ? (
        <div className="text-sm text-slate-500 italic py-6 relative z-10 text-center bg-slate-800/30 rounded-lg border border-slate-700/50 border-dashed">
          Select an asset to unlock simulation scenarios.
        </div>
      ) : (
        <div className="space-y-4 relative z-10 flex flex-col">
          {/* Tabs */}
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 shadow-inner">
            <button 
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'presets' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              Available Presets
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'active' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              Active Scenarios
              {activeDisruptions.length > 0 && (
                <span className="bg-accent-blue/20 text-accent-blue py-0.5 px-1.5 rounded-full text-[10px] leading-none">
                  {activeDisruptions.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 gap-3">
              {PRESET_DISRUPTIONS.map(preset => {
                const isActive = !!activeDisruptions.find(d => d.id === preset.id);
                const isMalacca = preset.id === 'MALACCA_BLOCKADE';
                const Icon = isMalacca ? Ship : BatteryWarning;
                
                return (
                  <button
                    key={preset.id}
                    onClick={() => togglePreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col gap-2 group ${
                      isActive 
                        ? 'bg-accent-blue/10 border-accent-blue/50 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 min-w-0 w-full">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-accent-blue/20 text-accent-blue' : 'bg-slate-700 text-slate-400 group-hover:text-slate-300'}`}>
                          <Icon size={16} />
                        </div>
                        <span className={`text-sm font-medium truncate flex-1 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {preset.title}
                        </span>
                      </div>
                      <div className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${isActive ? 'border-accent-blue bg-accent-blue' : 'border-slate-600'}`}>
                         {isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="flex flex-col gap-3">
              {activeDisruptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50 border-dashed">
                  No active scenarios.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {activeDisruptions.map(disruption => {
                    const isPreset = PRESET_DISRUPTIONS.find(p => p.id === disruption.id);
                    const isMalacca = disruption.id === 'MALACCA_BLOCKADE';
                    const isAi = !isPreset;

                    const Icon = isAi ? AlertTriangle : (isMalacca ? Ship : BatteryWarning);
                    
                    let bgClass: string;
                    let textClass: string;
                    let iconBg: string;

                    if (isAi) {
                      bgClass = 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]';
                      textClass = 'text-purple-400';
                      iconBg = 'bg-purple-500/20';
                    } else if (isMalacca) {
                      bgClass = 'bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
                      textClass = 'text-red-400';
                      iconBg = 'bg-red-500/20';
                    } else {
                      bgClass = 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
                      textClass = 'text-amber-400';
                      iconBg = 'bg-amber-500/20';
                    }

                    return (
                      <div key={disruption.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${bgClass}`}>
                        <div className="flex items-start justify-between gap-3 min-w-0">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${iconBg} ${textClass}`}>
                              <Icon size={16} />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${textClass} opacity-80 mb-0.5`}>
                                {isAi ? 'AI Alert' : 'Preset'}
                              </span>
                              <span className="text-sm font-semibold text-white truncate" title={disruption.title}>
                                {disruption.title}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeDisruption(disruption.id)} 
                            className={`shrink-0 p-1.5 rounded-md hover:bg-white/10 transition-colors mt-0.5 ${textClass}`}
                            aria-label="Remove Scenario"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Dynamic Impact Metrics */}
          {activeDisruptions.length > 0 && (
            <div className="mt-2 p-4 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent-blue" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Aggregated Impact</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Freight Rate
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-red-400">{globalModifiers.freightCostMultiplier.toFixed(1)}x</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Transit Delay
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-amber-400">+{globalModifiers.baseTransitDelay}</span>
                    <span className="text-xs text-amber-500/70 font-semibold uppercase">Days</span>
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
