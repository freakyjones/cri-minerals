import { useState, useMemo } from 'react';
import { useMinerals } from './useMineral';

export const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Battery Metals', value: 'battery-metal' },
  { label: 'Semiconductors', value: 'semiconductor' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Critical', value: 'critical' }
] as const;

export function useMineralDashboard() {
  const { minerals, loading } = useMinerals();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredMinerals = useMemo(() => {
    if (activeCategory === 'all') return minerals;
    return minerals.filter(m => m.category === activeCategory);
  }, [minerals, activeCategory]);

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
    filteredMinerals,
    riskCounts,
    categories: CATEGORIES
  };
}
