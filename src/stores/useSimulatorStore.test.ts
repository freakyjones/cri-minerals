import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSimulatorStore, DisruptionPayload, useEffectiveModifiers } from './useSimulatorStore';

describe('useSimulatorStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useSimulatorStore.setState({ activeDisruptions: [] });
  });

  const mockGlobalPriceSpike: DisruptionPayload = {
    id: 'global-spike',
    title: 'Global Shock',
    type: 'PRICE_SHOCK',
    multipliers: {
      freightCost: 1.0,
      transitDelay: 0,
      priceSpike: 1.5,
    }
  };

  const mockTargetedSpike: DisruptionPayload = {
    id: 'targeted-spike',
    title: 'Cobalt Shock',
    type: 'PRICE_SHOCK',
    affectedMinerals: ['Cobalt'],
    multipliers: {
      freightCost: 1.0,
      transitDelay: 0,
      priceSpike: 2.0,
    }
  };

  it('should add and remove disruptions', () => {
    useSimulatorStore.getState().addDisruption(mockGlobalPriceSpike);
    expect(useSimulatorStore.getState().activeDisruptions).toHaveLength(1);
    expect(useSimulatorStore.getState().activeDisruptions[0].id).toBe('global-spike');

    // Avoid duplicates
    useSimulatorStore.getState().addDisruption(mockGlobalPriceSpike);
    expect(useSimulatorStore.getState().activeDisruptions).toHaveLength(1);

    useSimulatorStore.getState().removeDisruption('global-spike');
    expect(useSimulatorStore.getState().activeDisruptions).toHaveLength(0);
  });

  it('should apply global price spikes to the requested mineral', () => {
    useSimulatorStore.getState().addDisruption(mockGlobalPriceSpike);
    const { result } = renderHook(() => {
      const disruptions = useSimulatorStore(state => state.activeDisruptions);
      return useEffectiveModifiers(disruptions, 'Copper');
    });
    expect(result.current.mineralPriceSpike['Copper']).toBe(1.5);
  });

  it('should apply targeted price spikes correctly', () => {
    useSimulatorStore.getState().addDisruption(mockTargetedSpike);
    
    // Viewing Cobalt should apply the spike
    let { result: cobaltResult } = renderHook(() => {
      const disruptions = useSimulatorStore(state => state.activeDisruptions);
      return useEffectiveModifiers(disruptions, 'Cobalt');
    });
    expect(cobaltResult.current.mineralPriceSpike['Cobalt']).toBe(2.0);

    // Viewing Copper should ignore the Cobalt spike
    let { result: copperResult } = renderHook(() => {
      const disruptions = useSimulatorStore(state => state.activeDisruptions);
      return useEffectiveModifiers(disruptions, 'Copper');
    });
    expect(copperResult.current.mineralPriceSpike['Cobalt']).toBeUndefined();
    expect(copperResult.current.mineralPriceSpike['Copper']).toBeUndefined();
  });

  it('should combine multiple disruptions correctly', () => {
    useSimulatorStore.getState().addDisruption({
      ...mockGlobalPriceSpike,
      multipliers: { freightCost: 1.2, transitDelay: 5, priceSpike: 1.1 }
    });
    useSimulatorStore.getState().addDisruption({
      ...mockTargetedSpike,
      affectedMinerals: ['Cobalt'],
      multipliers: { freightCost: 1.5, transitDelay: 10, priceSpike: 2.0 }
    });

    const { result } = renderHook(() => {
      const disruptions = useSimulatorStore(state => state.activeDisruptions);
      return useEffectiveModifiers(disruptions, 'Cobalt');
    });
    expect(result.current.freightCostMultiplier).toBeCloseTo(1.2 * 1.5);
    expect(result.current.baseTransitDelay).toBe(15);
    expect(result.current.mineralPriceSpike['Cobalt']).toBeCloseTo(1.1 * 2.0);
  });
});
