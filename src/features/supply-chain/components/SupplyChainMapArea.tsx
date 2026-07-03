import { useState } from 'react';
import { MapIcon, Pickaxe, Factory, Network, BarChart2 } from 'lucide-react';
import { Mineral } from '../../minerals/schema/mineralSchema';
import SupplyChainMap from './SupplyChainMap';
import SupplyChainFlow from './SupplyChainFlow';
import { SimulatedEvent } from './SupplyChainSimulator';

interface SupplyChainMapAreaProps {
  selectedMineral: Mineral | null;
  showTradeFlows: boolean;
  showChokePoints: boolean;
  showCompliance: boolean;
  simulatedEvent?: SimulatedEvent;
}

export type MapMode = 'NETWORK' | 'EXTRACTION' | 'REFINING';
export type MainView = 'MAP' | 'FLOW';

export default function SupplyChainMapArea({
  selectedMineral,
  showTradeFlows,
  showChokePoints,
  showCompliance,
  simulatedEvent
}: SupplyChainMapAreaProps) {
  const [mapMode, setMapMode] = useState<MapMode>('NETWORK');
  const [mainView, setMainView] = useState<MainView>('MAP');

  return (
    <div className="flex-1 relative z-0 h-full flex flex-col">
      {/* Top View Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-slate-950/90 backdrop-blur-sm border border-slate-800 p-1 rounded-lg shadow-2xl flex items-center">
          <button 
            onClick={() => setMainView('MAP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${mainView === 'MAP' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <MapIcon className="w-4 h-4" /> Map View
          </button>
          <button 
            onClick={() => setMainView('FLOW')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${mainView === 'FLOW' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart2 className="w-4 h-4" /> Flow View
          </button>
        </div>
      </div>

      {mainView === 'MAP' ? (
        <SupplyChainMap 
          mineral={selectedMineral} 
          showTradeFlows={showTradeFlows} 
          showChokePoints={showChokePoints} 
          showCompliance={showCompliance}
          simulatedEvent={simulatedEvent}
          mapMode={mapMode}
        />
      ) : (
        <SupplyChainFlow mineral={selectedMineral} />
      )}

      {/* Map Overlays (z-10) */}
      {mainView === 'MAP' && (
        <>
          <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
            <div className="bg-slate-950/90 backdrop-blur-sm border border-slate-800/80 p-3 rounded-lg shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-2 text-sm">
                <MapIcon className="w-4 h-4 text-accent-blue" />
                <span className="text-slate-400">View / </span>
                <span className="font-bold text-white">{selectedMineral ? selectedMineral.name : 'Global Network'}</span>
              </div>
            </div>
            
            {selectedMineral && (
              <div className="bg-slate-950/90 backdrop-blur-sm border border-slate-800/80 p-1.5 rounded-lg shadow-2xl pointer-events-auto flex items-center gap-1">
                <button 
                  onClick={() => setMapMode('NETWORK')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mapMode === 'NETWORK' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                  <Network className="w-3.5 h-3.5" /> Nodes
                </button>
                <button 
                  onClick={() => setMapMode('EXTRACTION')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mapMode === 'EXTRACTION' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-amber-200/70 hover:bg-slate-800/50 border border-transparent'}`}
                >
                  <Pickaxe className="w-3.5 h-3.5" /> Extraction
                </button>
                <button 
                  onClick={() => setMapMode('REFINING')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mapMode === 'REFINING' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-slate-400 hover:text-red-200/70 hover:bg-slate-800/50 border border-transparent'}`}
                >
                  <Factory className="w-3.5 h-3.5" /> Refining
                </button>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur-sm border border-slate-800/80 p-3 rounded-lg shadow-2xl pointer-events-auto">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-slate-900 shadow-[0_0_8px_rgba(239,68,68,0.7)]"></div>
                  <span>Choke Point</span>
                </li>
                <li className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="transparent" stroke="#fff" strokeWidth="2" className="w-3.5 h-3.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <span>Destination</span>
                </li>
                <li className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" className="w-3 h-3"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <span>Origin</span>
                </li>
              </ul>
            </div>
          </div>
          
          {!selectedMineral && (
            <div className="absolute inset-0 z-10 bg-slate-950/20 flex items-center justify-center pointer-events-none">
              <div className="bg-slate-950/90 border border-slate-800 p-6 rounded-xl shadow-2xl text-center max-w-sm">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <MapIcon className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Select an Asset</h3>
                <p className="text-sm text-slate-400">Choose a critical mineral from the sidebar to load its global network architecture.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
