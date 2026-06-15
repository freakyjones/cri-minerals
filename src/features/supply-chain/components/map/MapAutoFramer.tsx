import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapAutoFramerProps {
  nodes: Array<{ coords: [number, number] }>;
  chokePointCoords?: [number, number] | null;
}

export default function MapAutoFramer({ nodes, chokePointCoords }: MapAutoFramerProps) {
  const map = useMap();

  useEffect(() => {
    if (nodes.length === 0) return;

    // Collect all relevant coordinates to frame
    const points = nodes.map(n => L.latLng(n.coords[0], n.coords[1]));
    
    if (chokePointCoords) {
      points.push(L.latLng(chokePointCoords[0], chokePointCoords[1]));
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      
      // Smoothly fly to the exact bounding box, calculating the perfect discrete zoom level
      // padding ensures markers/lines aren't cut off at the edges
      map.flyToBounds(bounds, {
        padding: [60, 60],
        maxZoom: 6,
        animate: true,
        duration: 1.2
      });
    }
  }, [nodes, chokePointCoords, map]);

  return null;
}
