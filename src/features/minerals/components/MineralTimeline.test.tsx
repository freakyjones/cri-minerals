import { describe, it, expect } from 'vitest';
import { generateMockPriceData } from './MineralTimeline.utils';
import { TimelineEvent } from '../schema/mineralSchema';

describe('MineralTimeline - generateMockPriceData', () => {
  it('should return an empty array if timeline events are empty', () => {
    const result = generateMockPriceData([], 1000);
    expect(result).toEqual([]);
  });

  it('should generate prices deterministically based on year and current price', () => {
    const events: TimelineEvent[] = [
      { year: 2020, event: 'A', impact: 'High' },
      { year: 2022, event: 'B', impact: 'Low' },
    ];
    
    // Call it twice and ensure the results match perfectly (pure function)
    const run1 = generateMockPriceData(events, 100);
    const run2 = generateMockPriceData(events, 100);
    
    expect(run1).toEqual(run2);
    expect(run1.length).toBeGreaterThan(0);
  });

  it('should keep generated prices within realistic bounds (0.2x to 3x current price)', () => {
    const events: TimelineEvent[] = [
      { year: 2010, event: 'Event 1', impact: 'Medium' },
      { year: 2015, event: 'Event 2', impact: 'High' },
      { year: 2020, event: 'Event 3', impact: 'Low' },
      { year: 2022, event: 'Event 4', impact: 'Critical' },
    ];
    
    const currentPrice = 1000;
    const result = generateMockPriceData(events, currentPrice);

    // Validate bounds
    const minBound = currentPrice * 0.2;
    const maxBound = currentPrice * 3;

    result.forEach(dataPoint => {
      // It can dip below bounds in intermediate steps, but the clamp logic in the function 
      // multiplies by 2 if < 0.2x and by 0.5 if > 3x. We need to check if the final output respects it roughly.
      // Given the logic, the bound might be slightly exceeded right after the clamp check but it should be close.
      // We will check if it's within a slightly wider bound if the clamping logic is soft, but it should be within 0.2x and 3x 
      // after the clamp. Wait, the clamping happens *after* the generation step.
      // So the final value should strictly be >= 0.2x and <= 3x, except maybe the last year which is strictly currentPrice.
      expect(dataPoint.price).toBeGreaterThanOrEqual(minBound);
      expect(dataPoint.price).toBeLessThanOrEqual(maxBound);
    });
  });

  it('should ensure the last year ends at the current price', () => {
    const events: TimelineEvent[] = [
      { year: 2010, event: 'Event', impact: 'Medium' },
    ];
    
    const currentPrice = 1500;
    const result = generateMockPriceData(events, currentPrice);
    
    const lastDataPoint = result[result.length - 1];
    expect(lastDataPoint.year).toBe(new Date().getFullYear());
    expect(lastDataPoint.price).toBe(currentPrice);
  });
});
