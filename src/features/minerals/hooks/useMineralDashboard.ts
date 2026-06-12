import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const { minerals, loading, error, refetch } = useMinerals();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'all';
  const activeRisk = searchParams.get('risk') || null;

  const setActiveCategory = (category: string) => {
    setSearchParams(prev => {
      if (category === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', category);
      }
      return prev;
    });
  };

  const setActiveRisk = (risk: string | null) => {
    setSearchParams(prev => {
      if (!risk) {
        prev.delete('risk');
      } else {
        prev.set('risk', risk);
      }
      return prev;
    });
  };

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
    error,
    activeCategory,
    setActiveCategory,
    activeRisk,
    setActiveRisk,
    filteredMinerals,
    riskCounts,
    categories: CATEGORIES,
    refetch
  };
}
