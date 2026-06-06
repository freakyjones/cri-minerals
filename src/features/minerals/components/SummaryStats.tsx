import { ShieldAlert, Repeat, Recycle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';

interface SummaryStatsProps {
  mineral: Mineral;
}

const getRiskColor = (score: string) => {
  if (score === 'CRITICAL') return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (score === 'HIGH') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (score === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-green-500/20 text-green-400 border-green-500/30';
};

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
      {/* Risk Score */}
      <div className="bg-bg-surface border border-white/10 rounded-xl p-4 shadow-glass">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Supply Risk</span>
        </div>
        <Badge className={`${getRiskColor(mineral.riskScore)} border font-bold text-sm px-3 py-1`}>
          {mineral.riskScore}
        </Badge>
      </div>

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
        <span className={`text-2xl font-bold ${getRecycleColor(mineral.recyclingRate)}`}>
          {mineral.recyclingRate}%
        </span>
      </div>

      {/* ESG Alerts */}
      <div className="bg-bg-surface border border-white/10 rounded-xl p-4 shadow-glass">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">ESG Alerts</span>
        </div>
        {esgCount > 0 ? (
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm px-3 py-1">
            {esgCount} {esgCount === 1 ? 'Alert' : 'Alerts'}
          </Badge>
        ) : (
          <span className="text-lg font-bold text-green-400">Clear</span>
        )}
      </div>
    </div>
  );
}
