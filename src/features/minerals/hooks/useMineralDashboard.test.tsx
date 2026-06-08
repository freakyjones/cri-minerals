import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useMineralDashboard } from './useMineralDashboard';

// vi.mock is hoisted, so we must define the mock data inside it or use a separate file
vi.mock('./useMineral', () => {
  const mockMinerals = [
    { id: '1', category: 'battery-metal', riskScore: 'CRITICAL' },
    { id: '2', category: 'battery-metal', riskScore: 'HIGH' },
    { id: '3', category: 'semiconductor', riskScore: 'CRITICAL' },
    { id: '4', category: 'infrastructure', riskScore: 'LOW' },
  ];
  return {
    useMinerals: () => ({
      minerals: mockMinerals,
      loading: false
    })
  };
});

describe('useMineralDashboard', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  it('should return all minerals when activeCategory is "all"', () => {
    const { result } = renderHook(() => useMineralDashboard(), { wrapper });
    
    expect(result.current.activeCategory).toBe('all');
    expect(result.current.filteredMinerals.length).toBe(4);
  });

  it('should filter minerals by category when changed', () => {
    const { result } = renderHook(() => useMineralDashboard(), { wrapper });
    
    act(() => {
      result.current.setActiveCategory('battery-metal');
    });

    expect(result.current.activeCategory).toBe('battery-metal');
    expect(result.current.filteredMinerals.length).toBe(2);
  });

  it('should correctly calculate risk counts based on the dataset', () => {
    const { result } = renderHook(() => useMineralDashboard(), { wrapper });
    
    expect(result.current.riskCounts.CRITICAL).toBe(2);
    expect(result.current.riskCounts.HIGH).toBe(1);
    expect(result.current.riskCounts.MEDIUM).toBe(0);
    expect(result.current.riskCounts.LOW).toBe(1);
  });

  it('should expose the list of available categories', () => {
    const { result } = renderHook(() => useMineralDashboard(), { wrapper });
    
    expect(result.current.categories).toHaveLength(7);
    expect(result.current.categories[0].value).toBe('all');
  });
});
