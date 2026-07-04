export function normalizeShares(nmcShare: number, lfpShare: number, solidStateShare: number) {
  const total = nmcShare + lfpShare + solidStateShare;
  const nmcNorm = total === 0 ? 33.33 : (nmcShare / total) * 100;
  const lfpNorm = total === 0 ? 33.33 : (lfpShare / total) * 100;
  const solidStateNorm = total === 0 ? 33.33 : (solidStateShare / total) * 100;
  
  return { nmcNorm, lfpNorm, solidStateNorm };
}
