import { AlertCircle, FileSearch, ShieldAlert } from 'lucide-react';
import { getCountryComplianceTags, getCountryComplianceStatus } from '../../supply-chain/utils/countryCompliance';

interface Props {
  country: string;
  activeTag: string;
}

export default function CountryRiskProfile({ country, activeTag }: Props) {
  const status = getCountryComplianceStatus(country);
  const tags = getCountryComplianceTags(country);

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10 shadow-glass flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Entity Risk Profile</h3>
        <span className="text-sm font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded">
          {country}
        </span>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Regulatory Status</h4>
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            status === 'FEOC' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
            status === 'FTA' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
            'bg-orange-500/10 border-orange-500/20 text-orange-200'
          }`}>
            {status === 'FEOC' ? <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" /> : 
             status === 'FTA' ? <FileSearch className="w-5 h-5 text-emerald-400 shrink-0" /> :
             <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />}
            <div>
              <p className="font-semibold mb-1">
                {status === 'FEOC' ? 'Foreign Entity of Concern' :
                 status === 'FTA' ? 'Free Trade Agreement Partner' :
                 'Neutral / Elevated Risk Monitoring'}
              </p>
              <p className="text-xs opacity-80">
                {status === 'FEOC' ? `Procurement from ${country} will likely disqualify products from key subsidies (e.g., US IRA).` :
                 status === 'FTA' ? `Procurement from ${country} aligns with primary Western supply chain incentives.` :
                 `No specific ban, but general ESG monitoring is highly advised for ${country}.`}
              </p>
            </div>
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Identified Risk Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((t, idx) => (
                <span key={idx} className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wide font-medium ${
                  t.toLowerCase() === activeTag.toLowerCase() ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 ring-1 ring-accent-blue/50' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
