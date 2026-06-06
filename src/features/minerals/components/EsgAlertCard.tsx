import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Mineral } from '../schema/mineralSchema';

interface EsgAlertCardProps {
  mineral: Mineral;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'HUMAN_RIGHTS': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'CONFLICT': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'ENVIRONMENT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'GOVERNANCE': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'HUMAN_RIGHTS': return '👤 Human Rights';
    case 'CONFLICT': return '⚔️ Conflict';
    case 'ENVIRONMENT': return '🌿 Environment';
    case 'GOVERNANCE': return '🏛️ Governance';
    default: return category;
  }
};

const getSeverityColor = (severity: string) => {
  if (severity === 'CRITICAL') return 'bg-red-500 text-white';
  if (severity === 'HIGH') return 'bg-orange-500 text-white';
  if (severity === 'MEDIUM') return 'bg-yellow-500 text-black';
  return 'bg-green-500 text-white';
};

export default function EsgAlertCard({ mineral }: EsgAlertCardProps) {
  if (!mineral.esgRisks || mineral.esgRisks.length === 0) return null;

  return (
    <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        ESG Risk Alerts
      </h2>
      <div className="space-y-4">
        {mineral.esgRisks.map((risk, i) => (
          <div key={i} className="bg-black/30 border border-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{risk.country}</span>
                <Badge className={`${getCategoryColor(risk.category)} border text-xs`}>
                  {getCategoryLabel(risk.category)}
                </Badge>
              </div>
              <Badge className={`${getSeverityColor(risk.severity)} border-none text-xs font-bold`}>
                {risk.severity}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{risk.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
