import { useMemo } from 'react';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { getCoordinates } from '../../../lib/coordinates';
import chokePointsData from '../../../data/chokePoints.json';
import { findMacroPath, smoothRawPath, getClosestMacroNode, MACRO_NODES } from '../utils/MacroGraph';
import { getCountryComplianceStatus, ComplianceStatus, getCountryComplianceTags } from '../utils/countryCompliance';
import { SimulatedEvent } from '../components/SupplyChainSimulator';

export const useSupplyChainGraph = (
  mineral: Mineral | null,
  showCompliance: boolean,
  simulatedEvent: SimulatedEvent,
  activeScenario: string
) => {
  return useMemo(() => {
    if (!mineral || !mineral.production.length || !mineral.refining.length) {
      return { nodes: [], routes: [], chokePointCoords: null };
    }

    const topRefiner = [...mineral.refining].sort((a, b) => b.share - a.share)[0];
    const destinationCoords = getCoordinates(topRefiner.country);

    if (!destinationCoords) return { nodes: [], routes: [], chokePointCoords: null };

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
    }> = [];
    const routesData: Array<{
      key: string;
      positions: [number, number][];
      color: string;
      weight: number;
      isDisrupted?: boolean;
      isFrozen?: boolean;
    }> = [];

    // Compliance color helper
    const getComplianceColor = (country: string, defaultColor: string) => {
      if (!showCompliance) return defaultColor;
      const status = getCountryComplianceStatus(country);
      if (status === 'FEOC') return '#ef4444'; // Red
      if (status === 'FTA') return '#10b981'; // Green
      return '#94a3b8'; // Neutral gray
    };

    const refinerStatus = showCompliance ? getCountryComplianceStatus(topRefiner.country) : 'NEUTRAL';
    const refinerColor = getComplianceColor(topRefiner.country, mineral.color);

    nodesData.push({
      key: `refiner-${topRefiner.country}`,
      coords: destinationCoords,
      isRefiner: true,
      country: topRefiner.country,
      share: topRefiner.share,
      baseColor: refinerColor,
      complianceStatus: refinerStatus,
      complianceTags: showCompliance ? getCountryComplianceTags(topRefiner.country) : []
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
      const producerStatus = showCompliance ? getCountryComplianceStatus(producer.country) : 'NEUTRAL';
      const producerColor = getComplianceColor(producer.country, mineral.color);
      const finalColor = isEsgBanned ? '#ef4444' : producerColor;

      nodesData.push({
        key: `producer-${producer.country}`,
        coords: originCoords,
        isRefiner: false,
        country: producer.country,
        share: producer.share,
        baseColor: finalColor,
        complianceStatus: producerStatus,
        complianceTags: showCompliance ? getCountryComplianceTags(producer.country) : [],
        isDisrupted: isEsgBanned
      });

      const startNodeId = getClosestMacroNode(originCoords[0], originCoords[1]);
      const endNodeId = getClosestMacroNode(destinationCoords[0], destinationCoords[1]);
      
      let isRouteDisrupted = isEsgBanned;
      let isFrozen = false;
      let routeColor = finalColor;
      const disabledNodes: string[] = [];

      if (activeScenario === 'DRC_FREEZE' && (producer.country.includes('Congo') || producer.country === 'DRC')) {
        isFrozen = true;
        routeColor = '#475569';
      } else if (isEsgBanned) {
        routeColor = '#ef4444';
      }

      if (startNodeId && endNodeId && activeScenario === 'MALACCA_BLOCKADE') {
        const normalPath = findMacroPath(startNodeId, endNodeId, []);
        if (normalPath.includes('Malacca')) {
          isRouteDisrupted = true;
          routeColor = '#ef4444';
          disabledNodes.push('Malacca');
        }
      }

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
  }, [mineral, simulatedEvent, activeScenario, showCompliance]);
};
