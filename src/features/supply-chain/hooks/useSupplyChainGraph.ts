import { useMemo } from 'react';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { getCoordinates } from '../../../lib/coordinates';
import chokePointsData from '../../../data/chokePoints.json';
import { findMacroPath, smoothRawPath, getClosestMacroNode, MACRO_NODES } from '../utils/MacroGraph';
import { useComplianceStore, ComplianceStatus } from '../../../stores/useComplianceStore';
import { SimulatedEvent } from '../components/SupplyChainSimulator';
import { useSimulatorStore } from '../../../stores/useSimulatorStore';
import * as turf from '@turf/turf';

export const useSupplyChainGraph = (
  mineral: Mineral | null,
  showCompliance: boolean,
  simulatedEvent: SimulatedEvent,
  activeScenario: string
) => {
  const countries = useComplianceStore(state => state.countries);
  const getStatus = useComplianceStore(state => state.getStatus);
  const getTags = useComplianceStore(state => state.getTags);
  const activeDisruptions = useSimulatorStore(state => state.activeDisruptions);

  const parsedDisruptions = useMemo(() => {
    const relevantDisruptions = activeDisruptions.filter(d => {
      if (mineral && d.affectedMinerals && !d.affectedMinerals.includes(mineral.name)) return false;
      return true;
    });

    const dangerZones = relevantDisruptions
      .filter(d => d.type === 'DANGER_ZONE' && d.center && d.radiusKm)
      .map(d => {
        const centerPoint = turf.point([d.center![1], d.center![0]]);
        const polygon = turf.circle(centerPoint, d.radiusKm as number, { units: 'kilometers' });
        return {
          id: d.id,
          center: d.center as [number, number],
          centerPoint,
          radiusKm: d.radiusKm as number,
          polygon,
          bboxPoly: turf.bboxPolygon(turf.bbox(polygon))
        };
      });

    const disabledNodes = relevantDisruptions
      .filter(d => d.type === 'CHOKE_POINT_CLOSURE')
      .flatMap(d => d.targetNodes || []);

    const frozenOrigins = relevantDisruptions
      .filter(d => d.type === 'EXPORT_FREEZE')
      .flatMap(d => d.targetNodes || []);

    return { dangerZones, disabledNodes, frozenOrigins };
  }, [activeDisruptions, mineral]);

  return useMemo(() => {
    if (!mineral || !mineral.production.length || !mineral.refining.length) {
      return { nodes: [], routes: [], chokePointCoords: null, dangerZones: [] };
    }

    const topRefiner = [...mineral.refining].sort((a, b) => b.share - a.share)[0];
    const destinationCoords = getCoordinates(topRefiner.country);

    if (!destinationCoords) return { nodes: [], routes: [], chokePointCoords: null, dangerZones: [] };

    const nodesData: Array<{
      key: string;
      coords: [number, number];
      isRefiner: boolean;
      country: string;
      share: number;
      baseColor: string;
      complianceStatus: ComplianceStatus;
      complianceTags: string[];
      isDisrupted?: boolean;
      disruptionReason?: string;
    }> = [];
    const routesData: Array<{
      key: string;
      positions: [number, number][];
      color: string;
      weight: number;
      isDisrupted?: boolean;
      isFrozen?: boolean;
    }> = [];

    const { dangerZones, disabledNodes: initialDisabledNodes, frozenOrigins } = parsedDisruptions;
    const disabledNodes = [...initialDisabledNodes];

    // If active scenario string based legacy is used
    if (activeScenario === 'MALACCA_BLOCKADE') {
      if (!disabledNodes.includes('Malacca')) disabledNodes.push('Malacca');
    }

    // Compliance color helper
    const getComplianceColor = (country: string, defaultColor: string) => {
      if (!showCompliance) return defaultColor;
      const status = getStatus(country);
      if (status === 'FEOC') return '#ef4444'; // Red
      if (status === 'FTA') return '#10b981'; // Green
      return '#94a3b8'; // Neutral gray
    };

    const refinerStatus = showCompliance ? getStatus(topRefiner.country) : 'NEUTRAL';
    const refinerColor = getComplianceColor(topRefiner.country, mineral.color);

    nodesData.push({
      key: `refiner-${topRefiner.country}`,
      coords: destinationCoords,
      isRefiner: true,
      country: topRefiner.country,
      share: topRefiner.share,
      baseColor: refinerColor,
      complianceStatus: refinerStatus,
      complianceTags: showCompliance ? getTags(topRefiner.country) : []
    });

    const topProducers = [...mineral.production]
      .sort((a, b) => b.share - a.share)
      .slice(0, 10)
      .filter(p => p.country !== topRefiner.country);

    let blockedChokePointCoords: [number, number] | null = null;
    if (simulatedEvent?.type === 'CHOKE_POINT') {
      const cp = chokePointsData.find(c => c.id === simulatedEvent.targetId);
      if (cp) blockedChokePointCoords = [cp.lat, cp.lng];
    }

    topProducers.forEach(producer => {
      const originCoords = getCoordinates(producer.country);
      if (!originCoords) return;

      const isEsgBanned = simulatedEvent?.type === 'ESG_BAN' && simulatedEvent.targetId === producer.country;
      
      // Node intersection with Danger Zones
      let isNodeInDangerZone = false;
      const nodePoint = turf.point([originCoords[1], originCoords[0]]);
      const disruptingAlertNames: string[] = [];

      for (const zone of dangerZones) {
        const dist = turf.distance(zone.centerPoint, nodePoint, { units: 'kilometers' });
        if (dist <= zone.radiusKm) {
          isNodeInDangerZone = true;
          const disp = activeDisruptions.find(d => d.id === zone.id);
          if (disp) disruptingAlertNames.push(disp.title);
        }
      }

      const isFrozen = frozenOrigins.includes(producer.country);
      if (isFrozen) {
        const disp = activeDisruptions.find(d => d.type === 'EXPORT_FREEZE' && d.targetNodes?.includes(producer.country));
        if (disp) disruptingAlertNames.push(disp.title);
      }

      if (isEsgBanned) {
        disruptingAlertNames.push("ESG Compliance Restriction");
      }

      const isDisruptedNode = isEsgBanned || isNodeInDangerZone;
      const producerStatus = showCompliance ? getStatus(producer.country) : 'NEUTRAL';
      const producerColor = getComplianceColor(producer.country, mineral.color);
      const finalColor = isDisruptedNode ? '#ef4444' : (isFrozen ? '#475569' : producerColor);

      nodesData.push({
        key: `producer-${producer.country}`,
        coords: originCoords,
        isRefiner: false,
        country: producer.country,
        share: producer.share,
        baseColor: finalColor,
        complianceStatus: producerStatus,
        complianceTags: showCompliance ? getTags(producer.country) : [],
        isDisrupted: isDisruptedNode || isFrozen,
        disruptionReason: disruptingAlertNames.length > 0 ? disruptingAlertNames.join(', ') : undefined
      });

      const startNodeId = getClosestMacroNode(originCoords[0], originCoords[1]);
      const endNodeId = getClosestMacroNode(destinationCoords[0], destinationCoords[1]);
      
      let isRouteDisrupted = isDisruptedNode;
      let routeColor = finalColor;

      if (isFrozen) {
        routeColor = '#475569';
      } else if (isRouteDisrupted) {
        routeColor = '#ef4444';
      }

      let positions: [number, number][] = [originCoords, destinationCoords];

      if (startNodeId && endNodeId) {
        const pathNodes = findMacroPath(startNodeId, endNodeId, disabledNodes);
        
        // If route passes through disabled nodes or cannot find path, mark disrupted
        if (pathNodes.length === 0 && !isFrozen) {
            isRouteDisrupted = true;
            routeColor = '#ef4444';
        }

        if (pathNodes.length > 0) {
          const rawCoords: [number, number][] = [
            originCoords,
            ...pathNodes.map((id: string) => [MACRO_NODES[id].lat, MACRO_NODES[id].lng] as [number, number]),
            destinationCoords
          ];
          positions = smoothRawPath(rawCoords);
        }
      }

      // Check Turf Intersection for Routes against Danger Zones
      if (!isRouteDisrupted && positions.length > 1) {
        const lineCoords = positions.map(p => [p[1], p[0]]); // Leaflet to Turf
        const routeLine = turf.lineString(lineCoords);
        
        for (const zone of dangerZones) {
          if (turf.booleanIntersects(routeLine, zone.bboxPoly) && turf.booleanIntersects(routeLine, zone.polygon)) {
            isRouteDisrupted = true;
            routeColor = '#ef4444';
            break;
          }
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

    return { nodes: nodesData, routes: routesData, chokePointCoords: blockedChokePointCoords, dangerZones };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mineral, simulatedEvent, activeScenario, showCompliance, countries, getStatus, getTags, parsedDisruptions]);
};
