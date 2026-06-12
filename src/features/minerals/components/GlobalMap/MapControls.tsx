import { MapLayerType } from './index';
import { Database, Pickaxe, Factory, ShieldAlert, Crosshair, Layers, Settings2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface MapControlsProps {
  activeLayer: MapLayerType;
  onChangeLayer: (layer: MapLayerType) => void;
  showChoropleth: boolean;
  onToggleChoropleth: (show: boolean) => void;
}

export default function MapControls({ 
  activeLayer, 
  onChangeLayer, 
  showChoropleth, 
  onToggleChoropleth 
}: MapControlsProps) {
  
  const layers: { id: MapLayerType; label: string; icon: React.ReactNode }[] = [
    { id: 'reserves', label: 'Reserves', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'production', label: 'Production', icon: <Pickaxe className="w-3.5 h-3.5" /> },
    { id: 'refining', label: 'Refining', icon: <Factory className="w-3.5 h-3.5" /> },
    { id: 'esg', label: 'ESG Risks', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'chokePoints', label: 'Choke Points', icon: <Crosshair className="w-3.5 h-3.5" /> },
  ];

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative flex flex-col items-end pointer-events-auto">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2.5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/10 border-t-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-slate-300 hover:text-white hover:bg-slate-800/70 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 shrink-0 group z-50"
        title={isExpanded ? "Hide Map Controls" : "Show Map Controls"}
      >
        {isExpanded ? (
          <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 rotate-90" />
        ) : (
          <Settings2 className="w-5 h-5 text-accent-blue transition-transform duration-500 ease-out group-hover:rotate-45" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-3 right-0 flex flex-col gap-1 p-2 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] whitespace-nowrap z-40 min-w-[180px]"
          >
            {/* Map Layers */}
            <div className="flex flex-col gap-1 w-full">
              {layers.map(layer => {
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => onChangeLayer(layer.id)}
                    className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 z-10 ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-layer-pill"
                        className="absolute inset-0 bg-accent-blue/20 rounded-lg border border-accent-blue/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className={`transition-colors flex-shrink-0 ${isActive ? 'text-accent-blue' : 'text-slate-500'}`}>
                      {layer.icon}
                    </span>
                    <span className="flex-1 text-left">{layer.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="w-full h-px bg-white/10 my-1"></div>

            {/* Modern Switch */}
            <button 
              onClick={() => onToggleChoropleth(!showChoropleth)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
            >
              <Layers className={`w-3.5 h-3.5 transition-colors ${showChoropleth ? 'text-accent-blue' : 'text-slate-500'}`} />
              Choropleth
              <div 
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 ml-1 ${
                  showChoropleth ? 'bg-accent-blue' : 'bg-slate-700'
                }`}
              >
                <span 
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                    showChoropleth ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`} 
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
