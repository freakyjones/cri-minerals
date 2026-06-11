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

export const getRiskIcon = (score: string) => {
  if (score === 'CRITICAL') return '🔺';
  if (score === 'HIGH') return '🔶';
  if (score === 'MEDIUM') return '⏺';
  return '🟢';
};

export const getSubstitutabilityColor = (val: string) => {
  switch (val) {
    case 'Low': return 'text-red-400 bg-red-400/10 border border-red-400/20';
    case 'Medium': return 'text-amber-400 bg-amber-400/10 border border-amber-400/20';
    case 'High': return 'text-green-400 bg-green-400/10 border border-green-400/20';
    default: return 'text-slate-400 bg-slate-800 border border-slate-700';
  }
};

export const getRecyclingRateColor = (val: number) => {
  if (val < 10) return 'text-red-400 bg-red-400/10 border border-red-400/20';
  if (val < 30) return 'text-amber-400 bg-amber-400/10 border border-amber-400/20';
  return 'text-green-400 bg-green-400/10 border border-green-400/20';
};

export const isValidMapLocation = (country: string) => {
  return country !== 'Other' && country !== 'Global' && !country.startsWith('Uncertain') && country !== 'Abundant';
};
