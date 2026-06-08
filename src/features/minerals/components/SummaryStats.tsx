import { ShieldAlert, Repeat, Recycle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskColorTransparent } from '../utils';

interface SummaryStatsProps {
  mineral: Mineral;
}

const getSubColor = (score: string) => {
  if (score === 'HIGH') return 'text-green-400'; // HIGH substitutability = good
  if (score === 'MEDIUM') return 'text-yellow-400';
  return 'text-red-400'; // LOW substitutability = risky
};

const getRecycleColor = (rate: number) => {
  if (rate >= 50) return 'text-green-400';
  if (rate >= 20) return 'text-yellow-400';
  return 'text-red-400';
};

export default function SummaryStats({ mineral }: SummaryStatsProps) {
  const esgCount = mineral.esgRisks?.length ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {/* Supply Risk */}
      <a href="#supply-risk" className="bg-bg-surface border border-white/10 rounded-xl p-4 shadow-glass hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base outline-none block group">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium group-hover:text-white transition-colors">Supply Risk</span>
        </div>
        <Badge className={`${getRiskColorTransparent(mineral.riskScore)} border font-bold text-sm px-3 py-1 mt-1`}>
          {mineral.riskScore}
        </Badge>
      </a>

      {/* Substitutability */}
      <div className="bg-bg-surface border border-white/10 rounded-xl p-4 shadow-glass">
        <div className="flex items-center gap-2 mb-2">
          <Repeat className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Substitutability</span>
        </div>
        <span className={`text-lg font-bold ${getSubColor(mineral.substitutability)}`}>
          {mineral.substitutability}
        </span>
        {mineral.substituteMineral && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mineral.substituteMineral}</p>
        )}
      </div>

      {/* Recycling Rate */}
      <div className="bg-bg-surface border border-white/10 rounded-xl p-4 shadow-glass">
        <div className="flex items-center gap-2 mb-2">
          <Recycle className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Recycling Rate</span>
        </div>
        <span className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${getRecycleColor(mineral.recyclingRate)}`}>
          {mineral.recyclingRate}%
        </span>
      </div>

      {/* ESG Alerts */}
      <a href="#esg-alerts" className="bg-bg-surface border border-white/10 rounded-xl p-4 shadow-glass hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base outline-none block group">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium group-hover:text-white transition-colors">ESG Alerts</span>
        </div>
        {esgCount > 0 ? (
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm px-3 py-1 mt-1 font-mono tabular-nums tracking-tight">
            {esgCount} {esgCount === 1 ? 'Alert' : 'Alerts'}
          </Badge>
        ) : (
          <span className="text-lg font-bold text-green-400 mt-1 block">Clear</span>
        )}
      </a>
    </div>
  );
}
