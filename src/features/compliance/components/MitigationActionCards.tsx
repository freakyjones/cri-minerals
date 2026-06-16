import { ArrowRight, Box, Cpu, Recycle } from 'lucide-react';
import { useComplianceStore } from '../../../stores/useComplianceStore';

interface Props {
  country: string;
  activeTag: string;
}

export default function MitigationActionCards({ country }: Props) {
  const getStatus = useComplianceStore(state => state.getStatus);
  const status = getStatus(country);

  // Dynamic recommendations based on status
  const recommendations = [];

  if (status === 'FEOC') {
    recommendations.push({
      title: 'Shift to FTA Partners',
      desc: `Gradually decrease dependency on ${country} by securing long-term offtake agreements with Australia or Canada to maintain US IRA tax credit eligibility.`,
      icon: ArrowRight,
      color: 'text-emerald-400'
    });
    recommendations.push({
      title: 'Increase Recycled Content',
      desc: 'Accelerate "urban mining" capabilities. Recycled minerals produced domestically can bypass FEOC extraction penalties.',
      icon: Recycle,
      color: 'text-accent-blue'
    });
  } else if (status === 'FTA') {
    recommendations.push({
      title: 'Leverage Subsidy Premiums',
      desc: `Maximize procurement from ${country}. Final products utilizing these minerals command a "green premium" in the US/EU markets.`,
      icon: Box,
      color: 'text-emerald-400'
    });
  } else {
    recommendations.push({
      title: 'Enhanced ESG Auditing',
      desc: `Since ${country} is not an FTA partner but carries elevated risk, deploy strict IRMA (Initiative for Responsible Mining Assurance) audits for tier-2 suppliers.`,
      icon: Cpu,
      color: 'text-orange-400'
    });
  }

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10 shadow-glass h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">AI Mitigation Strategies</h3>
      <div className="space-y-4 flex-1">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer">
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${rec.color}`}>
                <rec.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-accent-blue transition-colors">{rec.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
