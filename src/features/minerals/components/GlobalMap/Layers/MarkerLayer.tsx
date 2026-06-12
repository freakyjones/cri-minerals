import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import * as L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Mineral } from '../../../schema/mineralSchema';
import { getCoordinates } from '../../../../../lib/coordinates';
import { isValidMapLocation } from '../../../utils';
import { MapLayerType } from '../index';
import CountryDossierPopup from '../CountryDossierPopup';

interface MarkerLayerProps {
  mineral: Mineral;
  activeLayer: MapLayerType;
}

// Create custom colored marker icons
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

export default function MarkerLayer({ mineral, activeLayer }: MarkerLayerProps) {
  
  // Choose the color based on the active layer
  const getLayerColor = () => {
    switch (activeLayer) {
      case 'esg': return '#ef4444'; // Red
      case 'chokePoints': return '#f97316'; // Orange
      case 'refining': return '#a855f7'; // Purple
      default: return mineral.color;
    }
  };

  const icon = createCustomIcon(getLayerColor());

  // Derive points based on active layer
  const mapPoints = useMemo(() => {
    const points: Array<{ country: string; share?: number; amount_mt?: number; lat: number; lng: number; typeLabel: string }> = [];

    const addPoint = (country: string, share?: number, amount_mt?: number, typeLabel: string = '') => {
      if (isValidMapLocation(country)) {
        const [lat, lng] = getCoordinates(country);
        if (lat !== 0 || lng !== 0) {
          // Check if point already exists (to prevent duplicates if country appears multiple times)
          if (!points.find(p => p.country === country)) {
            points.push({ country, share, amount_mt, lat, lng, typeLabel });
          }
        }
      }
    };

    switch (activeLayer) {
      case 'reserves':
        mineral.reserves.forEach(r => addPoint(r.country, r.share, r.amount_mt, 'Reserves'));
        break;
      case 'production':
        mineral.production.forEach(p => addPoint(p.country, p.share, p.amount_mt, 'Production'));
        break;
      case 'refining':
        mineral.refining.forEach(r => addPoint(r.country, r.share, undefined, 'Refining'));
        break;
      case 'esg':
        mineral.esgRisks?.forEach(e => addPoint(e.country, undefined, undefined, 'ESG Risk'));
        break;
      case 'chokePoints':
        mineral.chokePoints.forEach(c => {
          c.affectedCountries.forEach(country => addPoint(country, undefined, undefined, 'Choke Point'));
        });
        break;
    }

    return points;
  }, [mineral, activeLayer]);

  return (
    <MarkerClusterGroup 
      chunkedLoading
      maxClusterRadius={40}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
    >
      {mapPoints.map((point, idx) => (
        <Marker key={`${point.country}-${activeLayer}-${idx}`} position={[point.lat, point.lng]} icon={icon}>
          <CountryDossierPopup 
            country={point.country} 
            mineral={mineral}
            activeType={point.typeLabel}
            activeShare={point.share}
            activeAmount={point.amount_mt}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
