import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Mineral } from '../schema/mineralSchema';
import { getCoordinates } from '../../../lib/coordinates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface GlobalMapProps {
  mineral: Mineral;
}

// Create a custom pulsing dot icon using the mineral's hex color
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid #1e293b;
      box-shadow: 0 0 10px ${color};
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  });
};

export const GlobalMap = ({ mineral }: GlobalMapProps) => {
  const icon = createCustomIcon(mineral.color);

  // Combine reserves and production for mapping, filtering out non-specific locations
  const mapPoints: Array<{ type: string; country: string; share: number; amount_mt?: number; lat: number; lng: number }> = [];

  mineral.reserves.forEach(r => {
    if (r.country !== 'Other' && r.country !== 'Global' && !r.country.startsWith('Uncertain') && r.country !== 'Abundant') {
      const [lat, lng] = getCoordinates(r.country);
      if (lat !== 0 || lng !== 0) {
        mapPoints.push({ type: 'Reserves', ...r, lat, lng });
      }
    }
  });

  mineral.production.forEach(p => {
    if (p.country !== 'Other' && p.country !== 'Global' && !p.country.startsWith('Uncertain') && p.country !== 'Abundant') {
      const [lat, lng] = getCoordinates(p.country);
      if (lat !== 0 || lng !== 0) {
        // Slightly offset production markers if they overlap with reserves
        mapPoints.push({ type: 'Production', ...p, lat: lat + 1, lng: lng + 1 });
      }
    }
  });

  return (
    <Card className="col-span-1 lg:col-span-2 border-slate-800 bg-slate-900/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Globe className="h-5 w-5 text-slate-400" />
          Global Hotspots
        </CardTitle>
        <CardDescription className="text-slate-400">
          Geographic distribution of {mineral.name} reserves and production facilities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-800 relative z-0">
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            scrollWheelZoom={false}
            dragging={!L.Browser.mobile}
            className="h-full w-full bg-slate-950"
          >
            {/* Dark themed tile layer (CartoDB Dark Matter) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {mapPoints.map((point, idx) => (
              <Marker key={`${point.country}-${point.type}-${idx}`} position={[point.lat, point.lng]} icon={icon}>
                <Popup className="custom-popup">
                  <div className="p-1">
                    <div className="font-bold text-slate-900">{point.country}</div>
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div className="text-sm font-medium" style={{ color: mineral.color }}>
                      {point.type}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      Share: <strong>{point.share}%</strong>
                    </div>
                    {point.amount_mt !== undefined && (
                      <div className="text-xs text-slate-500 mt-1">
                        Est: {point.amount_mt.toLocaleString()} MT
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};
