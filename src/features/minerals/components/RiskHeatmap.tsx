import { Badge } from '@/components/ui/badge';
import { getRiskIcon } from '../utils';

interface RiskHeatmapProps {
  riskCounts: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  onRiskClick?: (risk: string) => void;
}

export default function RiskHeatmap({ riskCounts, onRiskClick }: RiskHeatmapProps) {
  const risks = [
    { key: 'CRITICAL', count: riskCounts.CRITICAL, dotClass: 'bg-risk-critical animate-pulse', textClass: 'text-red-400', label: 'Critical' },
    { key: 'HIGH', count: riskCounts.HIGH, dotClass: 'bg-risk-high', textClass: 'text-orange-400', label: 'High' },
    { key: 'MEDIUM', count: riskCounts.MEDIUM, dotClass: 'bg-risk-medium', textClass: 'text-yellow-400', label: 'Medium' },
    { key: 'LOW', count: riskCounts.LOW, dotClass: 'bg-risk-low', textClass: 'text-green-400', label: 'Low' },
  ];

  return (
    <div className="flex items-center gap-6 mb-8 p-4 bg-bg-surface border border-white/10 rounded-xl shadow-glass">
      <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Risk Overview</span>
      <div className="flex items-center gap-4">
        {risks.map(r => r.count > 0 && (
          <button
            key={r.key}
            onClick={() => onRiskClick?.(r.key)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base rounded px-1"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${r.dotClass}`}></span>
            <Badge variant="outline" className={`${r.textClass} border-none font-bold text-sm`}>
              {getRiskIcon(r.key)} {r.count}
            </Badge>
            <span className="text-xs text-slate-500">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
