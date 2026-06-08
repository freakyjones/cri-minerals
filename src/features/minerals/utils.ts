export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export const getRiskColorSolid = (score: string) => {
  if (score === 'CRITICAL') return 'bg-risk-critical text-white hover:bg-risk-critical/80';
  if (score === 'HIGH') return 'bg-risk-high text-white hover:bg-risk-high/80';
  if (score === 'MEDIUM') return 'bg-risk-medium text-white hover:bg-risk-medium/80';
  return 'bg-risk-low text-white hover:bg-risk-low/80';
};

export const getRiskColorTransparent = (score: string) => {
  if (score === 'CRITICAL') return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (score === 'HIGH') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (score === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-green-500/20 text-green-400 border-green-500/30';
};

/** Geometric icon prefix for risk badges (WCAG 2.1 AA — never rely on color alone) */
export const getRiskIcon = (score: string) => {
  if (score === 'CRITICAL') return '🔺';
  if (score === 'HIGH') return '🔶';
  if (score === 'MEDIUM') return '⏺';
  return '🟢';
};
