import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import * as turf from '@turf/turf';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { getCoordinates } from '../../../lib/coordinates';
import chokePointsData from '../../../data/chokePoints.json';

const createCustomIcon = (color: string, isRefiner: boolean, share: number) => {
  const baseSize = isRefiner ? 28 : 18;
  const sizeAddition = (share / 100) * 20; 
  const finalSize = Math.round(baseSize + sizeAddition);
  const anchor = Math.round(finalSize / 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isRefiner ? 'transparent' : color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hexagon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-icon',
    iconSize: [finalSize, finalSize],
    iconAnchor: [anchor, anchor],
    popupAnchor: [0, -anchor],
  });
};

const chokePointIcon = L.divIcon({
  html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]"></div>`,
  className: 'choke-point-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8]
});

interface SupplyChainMapProps {
  mineral: Mineral | null;
  showTradeFlows?: boolean;
  showChokePoints?: boolean;
}

export default function SupplyChainMap({ mineral, showTradeFlows = true, showChokePoints = true }: SupplyChainMapProps) {
  const { nodes, routes } = useMemo(() => {
    if (!mineral || !mineral.production.length || !mineral.refining.length) return { nodes: [], routes: [] };

    const topRefiner = [...mineral.refining].sort((a, b) => b.share - a.share)[0];
    const destinationCoords = getCoordinates(topRefiner.country);

    if (!destinationCoords) return { nodes: [], routes: [] };

    const nodesData: Array<{key: string, coords: [number, number], isRefiner: boolean, country: string, share: number, color: string, icon: L.DivIcon}> = [];
    const routesData: Array<{key: string, positions: [number, number][], color: string, weight: number}> = [];

    // Refiner node
    nodesData.push({
      key: `refiner-${topRefiner.country}`,
      coords: destinationCoords,
      isRefiner: true,
      country: topRefiner.country,
      share: topRefiner.share,
      color: mineral.color,
      icon: createCustomIcon(mineral.color, true, topRefiner.share)
    });

    const topProducers = [...mineral.production]
      .sort((a, b) => b.share - a.share)
      .slice(0, 10)
      .filter(p => p.country !== topRefiner.country);

    topProducers.forEach(producer => {
      const originCoords = getCoordinates(producer.country);
      if (!originCoords) return;

      nodesData.push({
        key: `producer-${producer.country}`,
        coords: originCoords,
        isRefiner: false,
        country: producer.country,
        share: producer.share,
        color: mineral.color,
        icon: createCustomIcon(mineral.color, false, producer.share)
      });

      // Fix Antimeridian Bug: add 360 to negative longitudes to force continuous drawing
      const originLng = originCoords[1] < -30 ? originCoords[1] + 360 : originCoords[1];
      const destLng = destinationCoords[1] < -30 ? destinationCoords[1] + 360 : destinationCoords[1];

      // Turf uses [longitude, latitude]
      const originPt = turf.point([originLng, originCoords[0]]);
      const destPt = turf.point([destLng, destinationCoords[0]]);
      
      const line = turf.greatCircle(originPt, destPt, { properties: { name: 'route' }, npoints: 100 });
      // Convert back to Leaflet's [latitude, longitude]
      const positions = line.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);

      routesData.push({
        key: `route-${producer.country}-${topRefiner.country}`,
        positions: positions,
        color: mineral.color,
        weight: Math.max(1, (producer.share / 100) * 8)
      });
    });

    return { nodes: nodesData, routes: routesData };
  }, [mineral]);

  return (
    <div className="absolute inset-0 z-0 bg-slate-950">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full bg-slate-950 z-0"
        preferCanvas={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Choke Points Layer */}
        {showChokePoints && chokePointsData.map(cp => (
          <Marker key={cp.id} position={[cp.lat, cp.lng] as [number, number]} icon={chokePointIcon} zIndexOffset={100}>
            <Popup className="custom-dark-popup">
              <div className="p-2">
                <h4 className="text-red-400 font-bold mb-1 uppercase tracking-wider text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Choke Point
                </h4>
                <p className="font-semibold text-slate-100 text-sm mb-1">{cp.name}</p>
                <p className="text-xs text-slate-400">{cp.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Trade Routes (Canvas Geodesic Arcs) */}
        {showTradeFlows && routes.map(route => (
          <Polyline 
            key={route.key} 
            positions={route.positions} 
            pathOptions={{ color: route.color, weight: route.weight, opacity: 0.6, lineCap: 'round' }} 
          />
        ))}

        {/* Facilities (Clustered) */}
        <MarkerClusterGroup 
          chunkedLoading 
          maxClusterRadius={40}
          showCoverageOnHover={false}
        >
          {nodes.map(node => (
            <Marker 
              key={node.key} 
              position={node.coords as [number, number]} 
              icon={node.icon}
              zIndexOffset={node.isRefiner ? 50 : 10}
            >
              <Popup className="custom-dark-popup">
                <div className="p-2">
                  <h4 className="font-bold text-slate-100 mb-1">{node.country}</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    {node.isRefiner ? 'Primary Refining Hub' : 'Extraction Source'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono text-white">{node.share.toFixed(1)}%</span>
                    <span className="text-[10px] text-slate-400 uppercase">Global Share</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
