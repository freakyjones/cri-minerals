import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import CustomZoomControls from './map/CustomZoomControls';
import MapAutoFramer from './map/MapAutoFramer';
import TradeRoutesLayer from './map/TradeRoutesLayer';
import { Mineral } from '../../minerals/schema/mineralSchema';
import chokePointsData from '../../../data/chokePoints.json';
import { useSimulatorStore } from '../../../stores/useSimulatorStore';
import { useSupplyChainGraph } from '../hooks/useSupplyChainGraph';
import { SimulatedEvent } from './SupplyChainSimulator';

const createCustomIcon = (color: string, isRefiner: boolean, share: number, complianceStatus: string = 'NEUTRAL') => {
  const baseSize = isRefiner ? 28 : 18;
  const sizeAddition = (share / 100) * 20; 
  const finalSize = Math.round(baseSize + sizeAddition);
  const anchor = Math.round(finalSize / 2);

  let svg;
  if (complianceStatus === 'FEOC') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isRefiner ? 'transparent' : color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (complianceStatus === 'FTA') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isRefiner ? 'transparent' : color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
  } else {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isRefiner ? 'transparent' : color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hexagon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
  }

  let className = 'custom-leaflet-icon';
  if (complianceStatus === 'FEOC') {
    className += ' animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]';
  } else if (complianceStatus === 'FTA') {
    className += ' drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  }

  return L.divIcon({
    html: svg,
    className,
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
  showCompliance?: boolean;
  simulatedEvent?: SimulatedEvent;
}

export default function SupplyChainMap({ 
  mineral, 
  showTradeFlows = true, 
  showChokePoints = true, 
  showCompliance = false,
  simulatedEvent = null 
}: SupplyChainMapProps) {
  const { state } = useSimulatorStore();
  const { activeScenario } = state;

  // Use the decoupled Scenario Engine hook
  const rawGraph = useSupplyChainGraph(mineral, showCompliance, simulatedEvent || null, activeScenario);

  // Map pure data nodes to UI icons
  const nodes = useMemo(() => {
    return rawGraph.nodes.map(node => ({
      ...node,
      icon: createCustomIcon(node.baseColor, node.isRefiner, node.share, node.complianceStatus)
    }));
  }, [rawGraph.nodes]);

  const { routes, chokePointCoords } = rawGraph;

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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-mono text-white">{node.share.toFixed(1)}%</span>
                    <span className="text-[10px] text-slate-400 uppercase">Global Share</span>
                  </div>
                  {node.complianceTags && node.complianceTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-700/50">
                      {node.complianceTags.map((tag: string, idx: number) => (
                        <Link 
                          key={idx} 
                          to={`/compliance?tag=${encodeURIComponent(tag)}&country=${encodeURIComponent(node.country)}`}
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer ${node.complianceStatus === 'FEOC' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : node.complianceStatus === 'FTA' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'}`}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
