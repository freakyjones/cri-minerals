import { useState, useMemo } from 'react';
import { useMinerals } from './useMineral';

export const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Battery Metals', value: 'battery-metal' },
  { label: 'Semiconductors', value: 'semiconductor' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Critical', value: 'critical' },
  { label: 'Defense', value: 'defense' },
  { label: 'Industrial', value: 'industrial' }
] as const;

export function useMineralDashboard() {
  const { minerals, loading } = useMinerals();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeRisk, setActiveRisk] = useState<string | null>(null);

  const filteredMinerals = useMemo(() => {
    let result = minerals;
    if (activeCategory !== 'all') {
      result = result.filter(m => m.category === activeCategory);
    }
    if (activeRisk) {
      result = result.filter(m => m.riskScore === activeRisk);
    }
    return result;
  }, [minerals, activeCategory, activeRisk]);

  const riskCounts = useMemo(() => {
    return {
      CRITICAL: minerals.filter(m => m.riskScore === 'CRITICAL').length,
      HIGH: minerals.filter(m => m.riskScore === 'HIGH').length,
      MEDIUM: minerals.filter(m => m.riskScore === 'MEDIUM').length,
      LOW: minerals.filter(m => m.riskScore === 'LOW').length
    };
  }, [minerals]);

  return {
    loading,
    activeCategory,
    setActiveCategory,
    activeRisk,
    setActiveRisk,
    filteredMinerals,
    riskCounts,
    categories: CATEGORIES
  };
}
