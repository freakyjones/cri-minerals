 
import { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { Mineral } from '../../../schema/mineralSchema';
import { MapLayerType } from '../index';

interface ChoroplethLayerProps {
  mineral: Mineral;
  activeLayer: MapLayerType;
}

export default function ChoroplethLayer({ mineral, activeLayer }: ChoroplethLayerProps) {
  const { data: geoData } = useQuery({
    queryKey: ['world-geojson'],
    queryFn: async () => {
      const res = await fetch('/world.geojson');
      if (!res.ok) throw new Error('Failed to load geojson');
      return res.json();
    },
    staleTime: Infinity,
  });

  // Compute a map of country name -> numeric value for the active layer
  const countryValues = useMemo(() => {
    const values: Record<string, number> = {};
    
    if (activeLayer === 'reserves') {
      mineral.reserves.forEach(r => values[r.country] = r.share);
    } else if (activeLayer === 'production') {
      mineral.production.forEach(p => values[p.country] = p.share);
    } else if (activeLayer === 'refining') {
      mineral.refining.forEach(r => values[r.country] = r.share);
    }
    // We only shade for metrics with percentages.
    return values;
  }, [mineral, activeLayer]);

  if (!geoData) return null;

  // We use the activeLayer as the key so Leaflet completely remounts the GeoJSON component
  // to apply new styles when the layer toggles.
  return (
    <GeoJSON 
      key={`choropleth-${activeLayer}`}
      data={geoData}
      style={(feature) => {
        const countryName = feature?.properties?.ADMIN || feature?.properties?.name;
        
        let fillColor = 'transparent';
        let fillOpacity = 0;
        let weight = 0.5;

        if (countryName) {
          const value = Object.entries(countryValues).find(
            ([key]) => key.toLowerCase() === countryName.toLowerCase()
          )?.[1];

          if (value !== undefined) {
            fillColor = mineral.color;
            // Linear mapping: 100% share = 0.7 opacity, 1% share = 0.1 opacity
            fillOpacity = Math.max(0.1, (value / 100) * 0.7);
            weight = 1;
          }
        }

        return {
          fillColor,
          fillOpacity,
          weight,
          color: '#334155', // Border color
        };
      }}
    />
  );
}
