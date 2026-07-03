import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import CustomZoomControls from './map/CustomZoomControls';
import MapAutoFramer from './map/MapAutoFramer';
import TradeRoutesLayer from './map/TradeRoutesLayer';
import { Mineral } from '../../minerals/schema/mineralSchema';
import chokePointsData from '../../../data/chokePoints.json';

import { useSupplyChainGraph } from '../hooks/useSupplyChainGraph';
import { SimulatedEvent } from './SupplyChainSimulator';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useSimulatorStore } from '../../../stores/useSimulatorStore';
import { MapMode } from './SupplyChainMapArea';

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
  mapMode?: MapMode;
}

export default function SupplyChainMap({ 
  mineral, 
  showTradeFlows = true, 
  showChokePoints = true, 
  showCompliance = false,
  simulatedEvent = null,
  mapMode = 'NETWORK'
}: SupplyChainMapProps) {
  // Use the decoupled Scenario Engine hook
  const rawGraph = useSupplyChainGraph(mineral, showCompliance, simulatedEvent || null, "");
  const activeDisruptions = useSimulatorStore(state => state.activeDisruptions);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/world-countries-lite.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Failed to load geojson", err));
  }, []);

  // Map pure data nodes to UI icons
  const nodes = useMemo(() => {
    return rawGraph.nodes.map(node => ({
      ...node,
      icon: createCustomIcon(node.baseColor, node.isRefiner, node.share, node.complianceStatus)
    }));
  }, [rawGraph.nodes]);

  const { routes, chokePointCoords, dangerZones } = rawGraph;

  // Choropleth Styling
  const getStyle = (feature: any) => {
    const defaultStyle = {
      fillColor: '#1e293b',
      weight: 1,
      opacity: 1,
      color: '#0f172a',
      fillOpacity: 0.4
    };

    if (!mineral || mapMode === 'NETWORK') return defaultStyle;

    const countryName = feature.properties.name;
    
    // Check if country matches extraction or refining
    const extractionMatch = mineral.production.find((e: any) => e.country === countryName || (e.country === 'DRC' && countryName === 'Democratic Republic of the Congo'));
    const refiningMatch = mineral.refining.find((r: any) => r.country === countryName);

    if (mapMode === 'EXTRACTION' && extractionMatch) {
      const share = extractionMatch.share;
      const intensity = share > 50 ? '#f59e0b' : share > 20 ? '#fbbf24' : share > 5 ? '#fcd34d' : '#fef3c7';
      return {
        ...defaultStyle,
        fillColor: intensity,
        fillOpacity: 0.6 + (share / 100) * 0.4,
        color: '#f59e0b',
        weight: 1.5
      };
    }

    if (mapMode === 'REFINING' && refiningMatch) {
      const share = refiningMatch.share;
      const intensity = share > 50 ? '#ef4444' : share > 20 ? '#f87171' : share > 5 ? '#fca5a5' : '#fee2e2';
      return {
        ...defaultStyle,
        fillColor: intensity,
        fillOpacity: 0.6 + (share / 100) * 0.4,
        color: '#ef4444',
        weight: 1.5
      };
    }

    return defaultStyle;
  };

  return (
    <div className="absolute inset-0 z-0 bg-slate-950">
      <ErrorBoundary fallback={<div className="absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500"><span className="text-3xl mb-2">🗺️</span><p>Supply chain map unavailable</p></div>}>
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

          {/* Choropleth Layer */}
          {geoData && mapMode !== 'NETWORK' && (
            <GeoJSON 
              key={`${mapMode}-${mineral?.id}`} // force re-render when mode or mineral changes
              data={geoData} 
              style={getStyle} 
            />
          )}

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

          {/* AI Danger Zones Layer */}
          {dangerZones?.map(zone => {
            const disruption = activeDisruptions.find(d => d.id === zone.id);
            return (
              <Circle
                key={`danger-${zone.id}`}
                center={zone.center}
                radius={zone.radiusKm * 1000} // Leaflet requires meters
                pathOptions={{ 
                  color: '#9333ea', 
                  fillColor: '#9333ea', 
                  fillOpacity: 0.15, 
                  weight: 2,
                  dashArray: '4 4'
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-2 max-w-[240px]">
                    <h4 className="text-purple-400 font-bold mb-1 uppercase tracking-wider text-[10px] flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Active AI Danger Zone
                    </h4>
                    {disruption && (
                      <>
                        <p className="font-semibold text-slate-100 text-sm mb-1">{disruption.title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          This zone blocks all transport routes and mining operations within a {zone.radiusKm}km radius.
                        </p>
                      </>
                    )}
                  </div>
                </Popup>
              </Circle>
            );
          })}

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

                    {node.isDisrupted && (
                      <div className="mt-2 pt-2 border-t border-red-500/20 text-red-400">
                        <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                          Disrupted by Scenario
                        </p>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {node.disruptionReason || 'Export restrictions or localized hazard.'}
                        </p>
                      </div>
                    )}

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
      </ErrorBoundary>
    </div>
  );
}
