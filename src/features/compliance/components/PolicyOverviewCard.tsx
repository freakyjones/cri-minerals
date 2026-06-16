import { ShieldAlert, Globe, AlertTriangle, FileText, Scale, LucideIcon } from 'lucide-react';

interface Props {
  activeTag: string;
}

const POLICY_DATA: Record<string, { title: string, desc: string, icon: LucideIcon, color: string }> = {
  'FEOC': {
    title: 'Foreign Entity of Concern (FEOC) - US IRA',
    desc: 'Under the US Inflation Reduction Act, EVs may lose tax credits if battery components or critical minerals are extracted, processed, or recycled by a FEOC. This typically includes entities owned by, controlled by, or subject to the jurisdiction of China, Russia, Iran, or North Korea.',
    icon: ShieldAlert,
    color: 'text-red-400'
  },
  'UFLPA': {
    title: 'Uyghur Forced Labor Prevention Act (UFLPA)',
    desc: 'Establishes a rebuttable presumption that goods mined, produced, or manufactured wholly or in part in Xinjiang, China are made with forced labor and prohibited from entry into the United States.',
    icon: AlertTriangle,
    color: 'text-orange-400'
  },
  'CRMA': {
    title: 'EU Critical Raw Materials Act',
    desc: 'Aims to ensure a secure and sustainable supply of critical raw materials for Europe\'s industry, mandating domestic extraction (10%), processing (40%), and recycling (15%) benchmarks by 2030.',
    icon: Globe,
    color: 'text-blue-400'
  },
  'Conflict Minerals': {
    title: 'Dodd-Frank 1502 & EU Conflict Minerals',
    desc: 'Requires companies to conduct due diligence to ensure minerals (3TG: tin, tungsten, tantalum, and gold) imported from conflict-affected or high-risk areas do not finance armed conflict or human rights abuses.',
    icon: Scale,
    color: 'text-purple-400'
  },
  'Sanctioned Entity': {
    title: 'Sanctioned Entities (OFAC/EU/UN)',
    desc: 'Entities subject to strict economic and trade sanctions by global bodies, prohibiting transactions, freezing assets, and imposing severe penalties for supply chain engagement.',
    icon: ShieldAlert,
    color: 'text-red-500'
  },
  'High ESG Risk': {
    title: 'High ESG & Reputational Risk',
    desc: 'Regions or entities characterized by systemic environmental degradation, child labor, severe water stress, or political instability. Engagement here risks severe brand damage and pre-regulatory exclusion.',
    icon: AlertTriangle,
    color: 'text-orange-500'
  }
};

export default function PolicyOverviewCard({ activeTag }: Props) {
  const policy = POLICY_DATA[activeTag] || {
    title: activeTag,
    desc: 'Detailed compliance tracking for this entity or tag.',
    icon: FileText,
    color: 'text-slate-400'
  };

  const Icon = policy.icon;

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10 shadow-glass">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-slate-950 border border-white/5 ${policy.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{policy.title}</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            {policy.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
