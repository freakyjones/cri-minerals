import { Card } from '@/components/ui/card';
import { getRiskIcon } from '../utils';

interface RiskHeatmapProps {
  riskCounts: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  activeRisk: string | null;
  onRiskClick: (risk: string | null) => void;
}

export default function RiskHeatmap({ riskCounts, activeRisk, onRiskClick }: RiskHeatmapProps) {
  const risks = [
    { key: 'CRITICAL', count: riskCounts.CRITICAL, bg: 'bg-risk-critical/10 hover:bg-risk-critical/20', border: 'border-risk-critical/30', activeBorder: 'border-risk-critical', text: 'text-red-400', label: 'Critical Risk' },
    { key: 'HIGH', count: riskCounts.HIGH, bg: 'bg-risk-high/10 hover:bg-risk-high/20', border: 'border-risk-high/30', activeBorder: 'border-risk-high', text: 'text-orange-400', label: 'High Risk' },
    { key: 'MEDIUM', count: riskCounts.MEDIUM, bg: 'bg-risk-medium/10 hover:bg-risk-medium/20', border: 'border-risk-medium/30', activeBorder: 'border-risk-medium', text: 'text-yellow-400', label: 'Medium Risk' },
    { key: 'LOW', count: riskCounts.LOW, bg: 'bg-risk-low/10 hover:bg-risk-low/20', border: 'border-risk-low/30', activeBorder: 'border-risk-low', text: 'text-green-400', label: 'Low Risk' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {risks.map(r => {
        const isActive = activeRisk === r.key;
        return (
          <button
            key={r.key}
            onClick={() => onRiskClick(isActive ? null : r.key)}
            className="text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-card w-full"
          >
            <Card className={`p-6 transition-all shadow-glass h-full border-2 ${isActive ? r.activeBorder : r.border} ${r.bg}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl ${r.text}`}>{getRiskIcon(r.key)}</span>
                <span className={`text-3xl font-bold font-mono tabular-nums tracking-tight ${r.text}`}>{r.count}</span>
              </div>
              <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">{r.label}</p>
              {isActive && (
                <div className="mt-2 text-xs text-accent-blue font-medium">Filtering active</div>
              )}
            </Card>
          </button>
        );
      })}
    </div>
  );
}
