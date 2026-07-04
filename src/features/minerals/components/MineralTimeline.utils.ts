import type { TimelineEvent } from '../schema/mineralSchema';

export function generateMockPriceData(sortedEvents: TimelineEvent[], currentPrice: number | undefined) {
  if (sortedEvents.length === 0) return [];
  
  const startYear = sortedEvents[0].year - 2;
  const endYear = new Date().getFullYear();
  const data = [];
  
  let basePrice = currentPrice ? currentPrice / 2 : 100;

  for (let year = startYear; year <= endYear; year++) {
    // Create some volatility without Math.random (pure)
    const pseudoRandom1 = (year * 7 % 10) / 10;
    const volatility = 1 + (Math.sin(year * 1.5) * 0.3) + (pseudoRandom1 * 0.2 - 0.1);
    
    // If there's an event this year, spike the price to simulate a "market shock"
    const hasEvent = sortedEvents.some(e => e.year === year);
    const pseudoRandom2 = (year * 3 % 10) / 10;
    const shockFactor = hasEvent ? 1.5 + pseudoRandom2 : 1;
    
    basePrice = basePrice * volatility * shockFactor;
    
    // Keep within bounds somewhat
    if (basePrice < (currentPrice || 100) * 0.2) basePrice *= 2;
    if (basePrice > (currentPrice || 100) * 3) basePrice *= 0.5;

    data.push({
      year,
      price: Math.round(basePrice)
    });
  }

  // Ensure the last year is close to current price if provided
  if (currentPrice) {
    data[data.length - 1].price = currentPrice;
  }

  return data;
}
