import { describe, it, expect } from 'vitest';
import { normalizeShares } from './BatteryChemistrySandbox.utils';

describe('BatteryChemistrySandbox - normalizeShares', () => {
  it('should normalize shares to exactly 100% when total is > 0', () => {
    const { nmcNorm, lfpNorm, solidStateNorm } = normalizeShares(50, 30, 20);
    expect(nmcNorm).toBe(50);
    expect(lfpNorm).toBe(30);
    expect(solidStateNorm).toBe(20);
    expect(nmcNorm + lfpNorm + solidStateNorm).toBe(100);
  });

  it('should handle zero inputs by distributing evenly (33.33)', () => {
    const { nmcNorm, lfpNorm, solidStateNorm } = normalizeShares(0, 0, 0);
    expect(nmcNorm).toBeCloseTo(33.33);
    expect(lfpNorm).toBeCloseTo(33.33);
    expect(solidStateNorm).toBeCloseTo(33.33);
    expect(nmcNorm + lfpNorm + solidStateNorm).toBeCloseTo(99.99);
  });

  it('should normalize disproportionate inputs to 100%', () => {
    const { nmcNorm, lfpNorm, solidStateNorm } = normalizeShares(100, 100, 100);
    expect(nmcNorm).toBeCloseTo(33.33);
    expect(lfpNorm).toBeCloseTo(33.33);
    expect(solidStateNorm).toBeCloseTo(33.33);
  });

  it('should handle extreme values correctly', () => {
    const { nmcNorm, lfpNorm, solidStateNorm } = normalizeShares(0, 100, 0);
    expect(nmcNorm).toBe(0);
    expect(lfpNorm).toBe(100);
    expect(solidStateNorm).toBe(0);
  });
});
