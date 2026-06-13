import { useState, useMemo } from 'react';
import { Search, Layers } from 'lucide-react';
import { Mineral } from '../../minerals/schema/mineralSchema';

interface SupplyChainSidebarProps {
  filteredMinerals: Mineral[];
  loading: boolean;
  selectedMineral: Mineral | null;
  setSelectedMineral: (mineral: Mineral | null) => void;
  showTradeFlows: boolean;
  setShowTradeFlows: (val: boolean) => void;
  showChokePoints: boolean;
  setShowChokePoints: (val: boolean) => void;
  isMobile: boolean;
}

export default function SupplyChainSidebar({
  filteredMinerals,
  loading,
  selectedMineral,
  setSelectedMineral,
  showTradeFlows,
  setShowTradeFlows,
  showChokePoints,
  setShowChokePoints,
  isMobile
}: SupplyChainSidebarProps) {
  // Local state pushed down
  const [searchQuery, setSearchQuery] = useState('');

  const searchedMinerals = useMemo(() => {
    if (!searchQuery.trim()) return filteredMinerals;
    const q = searchQuery.toLowerCase();
    return filteredMinerals.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.symbol.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }, [filteredMinerals, searchQuery]);

  return (
    <div className={`w-full md:w-64 lg:w-72 flex-shrink-0 border-r md:border-b-0 border-b border-slate-800 bg-slate-950/80 z-20 flex flex-col md:h-full overflow-hidden transition-all duration-300 ${isMobile && selectedMineral ? 'h-14' : isMobile ? 'h-[45vh]' : 'h-auto'}`}>
      {isMobile && selectedMineral ? (
        <div className="flex items-center justify-between p-3 h-full">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <span className="w-3 h-3 rounded block shadow-sm" style={{ backgroundColor: selectedMineral.color }}></span>
            <span className="font-bold text-white text-sm">{selectedMineral.name}</span>
          </div>
          <button onClick={() => setSelectedMineral(null)} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded">View All</button>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-slate-800/80 shrink-0">
            <h2 className="text-sm font-bold tracking-wider text-slate-300 uppercase mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              Asset Locator
            </h2>
            <input 
              type="text" 
              placeholder="Search minerals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {loading ? (
              <div className="p-2 space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-10 bg-slate-800/50 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {searchedMinerals.map(mineral => (
                  <button
                    key={mineral.id}
                    onClick={() => setSelectedMineral(mineral)}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue border text-sm ${
                      selectedMineral?.id === mineral.id 
                        ? 'bg-slate-800/90 border-slate-600 shadow-inner' 
                        : 'bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line react/forbid-dom-props */}
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: mineral.color }}></div>
                      <div className="flex flex-col">
                        <span className={`font-medium ${selectedMineral?.id === mineral.id ? 'text-white' : 'text-slate-300'}`}>
                          {mineral.name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase">{mineral.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800/80 shrink-0 bg-slate-900/50">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Layer Visibility
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={showTradeFlows} 
                  onChange={() => setShowTradeFlows(!showTradeFlows)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-accent-blue focus:ring-accent-blue focus:ring-offset-slate-900" 
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Trade Flows</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={showChokePoints} 
                  onChange={() => setShowChokePoints(!showChokePoints)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-red-500 focus:ring-red-500 focus:ring-offset-slate-900" 
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Geopolitical Choke Points</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
