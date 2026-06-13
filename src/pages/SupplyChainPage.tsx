import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapIcon, Layers, AlertTriangle, FileText, ArrowRightLeft } from 'lucide-react';
import { useMineralDashboard } from '../features/minerals';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { ErrorState } from '../components/ui/ErrorState';
import { SEO } from '../components/SEO';
import SupplyChainMap from '../features/supply-chain/components/SupplyChainMap';
import { Mineral } from '../features/minerals/schema/mineralSchema';
import { useIsMobile } from '../hooks/useIsMobile';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function SupplyChainPage() {
  const { filteredMinerals, loading, error, refetch } = useMineralDashboard();
  const [selectedMineral, setSelectedMineral] = useState<Mineral | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  // Layer Toggles
  const [showTradeFlows, setShowTradeFlows] = useState(true);
  const [showChokePoints, setShowChokePoints] = useState(true);

  const pageVariants = useAccessibleVariants(pageVariantsFull);

  const searchedMinerals = useMemo(() => {
    if (!searchQuery.trim()) return filteredMinerals;
    const q = searchQuery.toLowerCase();
    return filteredMinerals.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.symbol.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }, [filteredMinerals, searchQuery]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-950">
        <ErrorState error={error} onRetry={refetch} title="Failed to load supply chain data" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Supply Chain Intelligence | CriMinerals" description="Enterprise three-pane supply chain mapping and analytics for critical minerals." />
      <motion.div 
        className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-bg-base relative"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        
        {/* 1. LEFT SIDEBAR (Navigation & Controls) */}
        <div className={`w-full md:w-64 lg:w-72 flex-shrink-0 border-r md:border-b-0 border-b border-slate-800 bg-slate-950/80 z-20 flex flex-col md:h-full overflow-hidden transition-all duration-300 ${isMobile && selectedMineral ? 'h-14' : isMobile ? 'h-[45vh]' : 'h-auto'}`}>
          {isMobile && selectedMineral ? (
            <div className="flex items-center justify-between p-3 h-full">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line react/forbid-dom-props -- Dynamic color from data — Rule 2.1.1 exception */}
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
                          {/* eslint-disable-next-line react/forbid-dom-props -- Dynamic color from data — Rule 2.1.1 exception */}
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

        {/* 2. CENTER CANVAS (Map Area) */}
        <div className="flex-1 relative z-0 h-full">
          <SupplyChainMap 
            mineral={selectedMineral} 
            showTradeFlows={showTradeFlows} 
            showChokePoints={showChokePoints} 
          />

          {/* Map Overlays (z-10) */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur-sm border border-slate-800/80 p-3 rounded-lg shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-2 text-sm">
                <MapIcon className="w-4 h-4 text-accent-blue" />
                <span className="text-slate-400">Network / </span>
                <span className="font-bold text-white">{selectedMineral ? selectedMineral.name : 'Global View'}</span>
              </div>
            </div>
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
        </div>

        {/* 3. RIGHT DETAILED PANEL (Analytics) */}
        <div className={`w-full md:w-[360px] flex-shrink-0 border-l border-slate-800 bg-slate-950/80 z-20 flex flex-col md:h-full overflow-hidden transition-all duration-300 ${isMobile && selectedMineral ? 'h-[40vh]' : isMobile ? 'h-0 border-none' : 'h-auto'}`}>
          {selectedMineral ? (
            <>
              <div className="p-5 border-b border-slate-800/80 bg-slate-900/50">
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                  {/* eslint-disable-next-line react/forbid-dom-props -- Dynamic color from data — Rule 2.1.1 exception */}
                  <span className="w-4 h-4 rounded shadow-sm block" style={{ backgroundColor: selectedMineral.color }}></span>
                  {selectedMineral.name}
                </h2>
                <p className="text-sm font-mono text-slate-400">{selectedMineral.symbol} • {selectedMineral.category}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Market Data (LME)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase mb-1">Current Price</p>
                      <p className="font-mono text-white text-lg">--- <span className="text-xs text-slate-400">/t</span></p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase mb-1">24h Change</p>
                      <p className="font-mono text-lg text-slate-400">---%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Risk Analysis
                  </h3>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Supply Risk Factor</span>
                      <span className="font-mono text-orange-400 font-bold">{selectedMineral.riskScore}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
                      {/* eslint-disable-next-line react/forbid-dom-props -- Dynamic width from data — Rule 2.1.1 exception */}
                      <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: selectedMineral.riskScore === 'CRITICAL' ? '100%' : selectedMineral.riskScore === 'HIGH' ? '75%' : selectedMineral.riskScore === 'MEDIUM' ? '50%' : '25%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      High concentration of refining capacity creates significant supply chain vulnerability, compounded by strict export regulations in primary producing regions.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" /> Dependencies
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 rounded-lg p-3 flex items-center justify-between group">
                      <span className="text-sm text-slate-300">Upstream Extraction</span>
                      <ArrowRightLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </button>
                    <button className="w-full text-left bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 rounded-lg p-3 flex items-center justify-between group">
                      <span className="text-sm text-slate-300">Downstream EV Mfg</span>
                      <ArrowRightLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 hidden md:flex">
              <FileText className="w-12 h-12 mb-4 text-slate-800" />
              <p>Select a mineral to view detailed analytics and risk profiles.</p>
            </div>
          )}
        </div>

      </motion.div>
    </>
  );
}
