import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import CustomZoomControls from './map/CustomZoomControls';
import MapAutoFramer from './map/MapAutoFramer';
import TradeRoutesLayer from './map/TradeRoutesLayer';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { getCoordinates } from '../../../lib/coordinates';
import chokePointsData from '../../../data/chokePoints.json';
import { useSimulatorStore } from '../../simulator/store/simulatorStore';
import { findMacroPath, smoothRawPath, getClosestMacroNode, MACRO_NODES } from '../utils/MacroGraph';

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
  const activeScenario = useSimulatorStore((state) => state.activeScenario);

  const { nodes, routes, chokePointCoords } = useMemo(() => {
    if (!mineral || !mineral.production.length || !mineral.refining.length) return { nodes: [], routes: [], chokePointCoords: null };

    const topRefiner = [...mineral.refining].sort((a, b) => b.share - a.share)[0];
    const destinationCoords = getCoordinates(topRefiner.country);

    if (!destinationCoords) return { nodes: [], routes: [], chokePointCoords: null };

    const nodesData: Array<{key: string, coords: [number, number], isRefiner: boolean, country: string, share: number, color: string, icon: L.DivIcon, isDisrupted?: boolean}> = [];
    const routesData: Array<{key: string, positions: [number, number][], color: string, weight: number, isDisrupted?: boolean, isFrozen?: boolean}> = [];

    // Check if refiner is disrupted (not currently supported, but good for future)
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

    // Choke point blocked polygon check
    let blockedChokePointCoords: [number, number] | null = null;
    if (activeScenario === 'MALACCA_BLOCKADE') {
      const cp = chokePointsData.find(c => c.id === 'Malacca');
      if (cp) blockedChokePointCoords = [cp.lat, cp.lng];
    }

// ... (inside component)

    topProducers.forEach(producer => {
      const originCoords = getCoordinates(producer.country);
      if (!originCoords) return;

      // --- Macro-Declarative Waypoint Graph Logic ---
      const startNodeId = getClosestMacroNode(originCoords[0], originCoords[1]);
      const endNodeId = getClosestMacroNode(destinationCoords[0], destinationCoords[1]);
      
      let isRouteDisrupted = false;
      let isFrozen = false;
      let routeColor = mineral.color;
      const disabledNodes: string[] = [];

      // DRC Freeze scenario check
      if (activeScenario === 'DRC_FREEZE' && (producer.country.includes('Congo') || producer.country === 'DRC')) {
        isFrozen = true;
        routeColor = '#475569'; // Muted slate-600
      }

      if (startNodeId && endNodeId) {
        // If blockade is active, check if the normal route relies on the blocked node
        if (activeScenario === 'MALACCA_BLOCKADE') {
          const normalPath = findMacroPath(startNodeId, endNodeId, []);
          if (normalPath.includes('Malacca')) {
            isRouteDisrupted = true;
            routeColor = '#f59e0b'; // Amber bypass warning color
            disabledNodes.push('Malacca');
          }
        }
      }

      nodesData.push({
        key: `producer-${producer.country}`,
        coords: originCoords,
        isRefiner: false,
        country: producer.country,
        share: producer.share,
        color: isFrozen ? '#475569' : mineral.color,
        icon: createCustomIcon(isFrozen ? '#475569' : mineral.color, false, producer.share),
        isDisrupted: false
      });

      let positions: [number, number][] = [originCoords, destinationCoords];

      if (startNodeId && endNodeId) {
        const pathNodes = findMacroPath(startNodeId, endNodeId, disabledNodes);
        if (pathNodes.length > 0) {
          const rawCoords: [number, number][] = [
            originCoords,
            ...pathNodes.map((id: string) => [MACRO_NODES[id].lat, MACRO_NODES[id].lng] as [number, number]),
            destinationCoords
          ];
          positions = smoothRawPath(rawCoords);
        }
      }

      routesData.push({
        key: `route-${producer.country}-${topRefiner.country}`,
        positions: positions,
        color: routeColor,
        weight: Math.max(1, (producer.share / 100) * 8),
        isDisrupted: isRouteDisrupted,
        isFrozen: isFrozen
      });
    });

    return { nodes: nodesData, routes: routesData, chokePointCoords: blockedChokePointCoords };
  }, [mineral, activeScenario]);

  return (
    <div className="absolute inset-0 z-0 bg-slate-950">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        minZoom={2}
        maxZoom={8}
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
        className="w-full h-full bg-slate-950 z-0"
      >
        <CustomZoomControls minZoom={2} maxZoom={8} />
        <MapAutoFramer nodes={nodes} chokePointCoords={chokePointCoords} />
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
        <TradeRoutesLayer routes={routes} showTradeFlows={showTradeFlows} minZoomThreshold={2} />

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
