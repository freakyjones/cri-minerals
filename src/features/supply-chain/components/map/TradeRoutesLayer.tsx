import { useState } from 'react';
import { useMapEvents, Polyline } from 'react-leaflet';

interface RouteData {
  key: string;
  positions: [number, number][];
  color: string;
  weight: number;
  isDisrupted?: boolean;
  isFrozen?: boolean;
}

interface TradeRoutesLayerProps {
  routes: RouteData[];
  showTradeFlows: boolean;
  minZoomThreshold?: number;
}

export default function TradeRoutesLayer({ routes, showTradeFlows, minZoomThreshold = 3 }: TradeRoutesLayerProps) {
  const [zoom, setZoom] = useState<number>(2);

  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
    load: () => {
      setZoom(map.getZoom());
    }
  });

  // Ensure initial sync
  if (map && zoom !== map.getZoom()) {
    setZoom(map.getZoom());
  }

  // LOD (Level of Detail) check: Hide routes if map is zoomed out too far
  if (!showTradeFlows || zoom < minZoomThreshold) {
    return null;
  }

  return (
    <>
      {routes.map(route => (
        <Polyline 
          key={route.key} 
          positions={route.positions} 
          color={route.color}
          weight={route.weight}
          opacity={route.isFrozen ? 0.2 : (route.isDisrupted ? 0.8 : 0.6)}
          dashArray={route.isDisrupted ? '5, 10' : undefined}
          lineCap="round"
        />
      ))}
    </>
  );
}
