import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ReservesChart from './ReservesChart';
import type { Mineral } from '../schema/mineralSchema';

interface ChokePointsProps {
  mineral: Mineral;
}

const getRiskColor = (score: string) => {
  if (score === 'CRITICAL' || score === 'HIGH') return 'bg-risk-high text-white';
  if (score === 'MEDIUM') return 'bg-risk-medium text-white';
  return 'bg-risk-low text-white';
};

export default function ChokePoints({ mineral }: ChokePointsProps) {
  return (
    <Card className="bg-bg-surface border-risk-high/30 p-6 shadow-glass relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-risk-high opacity-5 blur-[80px] pointer-events-none"></div>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="text-risk-high">⚠</span> Supply Chain Vulnerabilities
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 border-r border-white/10 pr-6">
          <h3 className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">Refining Dominance</h3>
          <ReservesChart data={mineral.refining} /> 
        </div>
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h3 className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">Identified Choke Points</h3>
          {mineral.chokePoints.map((cp, i) => (
            <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-white text-lg">{cp.title}</h4>
                <Badge className={`${getRiskColor(cp.severity)} border-none uppercase text-xs animate-pulse-glow`}>{cp.severity}</Badge>
              </div>
              <p className="text-gray-300 text-sm mb-3">{cp.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-gray-500">Most Affected:</span>
                {cp.affectedCountries.map((c, j) => (
                  <span key={j} className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
