import { useState, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Mineral } from '../../schema/mineralSchema';
import MapControls from './MapControls';

const MarkerLayer = lazy(() => import('./Layers/MarkerLayer'));
const ChoroplethLayer = lazy(() => import('./Layers/ChoroplethLayer'));

export type MapLayerType = 'reserves' | 'production' | 'refining' | 'esg' | 'chokePoints';

interface GlobalMapProps {
  mineral: Mineral;
}

export default function GlobalMap({ mineral }: GlobalMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('reserves');
  const [showChoropleth, setShowChoropleth] = useState(false);

  return (
    <Card className="col-span-1 lg:col-span-2 border-slate-800 bg-slate-900/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Globe className="h-5 w-5 text-slate-400" />
          Global Hotspots
        </CardTitle>
        <CardDescription className="text-slate-400">
          Geographic distribution of {mineral.name} across the supply chain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full rounded-xl overflow-hidden border border-slate-700/50 relative z-0 ring-1 ring-white/10 shadow-inner">
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            scrollWheelZoom={false}
            dragging={!L.Browser.mobile}
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full bg-slate-950"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <Suspense fallback={null}>
              {showChoropleth && (
                <ChoroplethLayer mineral={mineral} activeLayer={activeLayer} />
              )}
              <MarkerLayer mineral={mineral} activeLayer={activeLayer} />
            </Suspense>
          </MapContainer>

          {/* Floating Controls Overlay */}
          <div className="absolute top-4 right-4 z-[1000] pointer-events-none flex justify-end">
            <MapControls 
              activeLayer={activeLayer} 
              onChangeLayer={setActiveLayer}
              showChoropleth={showChoropleth}
              onToggleChoropleth={setShowChoropleth}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
