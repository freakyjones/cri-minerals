import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { Plus, Minus } from 'lucide-react';

interface CustomZoomControlsProps {
  minZoom?: number;
  maxZoom?: number;
}

export default function CustomZoomControls({ minZoom = 2, maxZoom = 8 }: CustomZoomControlsProps) {
  const [zoom, setZoom] = useState<number>(2);

  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    }
  });

  // Ensure initial sync
  if (map && zoom !== map.getZoom()) {
    setZoom(map.getZoom());
  }

  const isMinZoom = zoom <= minZoom;
  const isMaxZoom = zoom >= maxZoom;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMaxZoom) {
      map.zoomIn();
    }
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMinZoom) {
      map.zoomOut();
    }
  };

  return (
    <div className="absolute bottom-8 right-8 z-[1000] flex flex-col bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-md">
      <button 
        className={`p-3.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 ${isMaxZoom ? 'opacity-30 pointer-events-none' : ''}`}
        onClick={handleZoomIn}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <Plus size={20} />
      </button>
      <div className="w-full h-px bg-slate-700/50" />
      <button 
        className={`p-3.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 ${isMinZoom ? 'opacity-30 pointer-events-none' : ''}`}
        onClick={handleZoomOut}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <Minus size={20} />
      </button>
    </div>
  );
}
