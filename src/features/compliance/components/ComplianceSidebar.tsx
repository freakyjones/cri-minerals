import { Search, ShieldAlert, FileText, Globe, AlertTriangle, Scale } from 'lucide-react';
import { SetURLSearchParams } from 'react-router-dom';

interface SidebarProps {
  activeTag: string | null;
  activeCountry: string | null;
  setSearchParams: SetURLSearchParams;
  isMobile: boolean;
}

export default function ComplianceSidebar({ activeTag, activeCountry, setSearchParams, isMobile }: SidebarProps) {
  const frameworks = [
    { id: 'FEOC', label: 'US IRA & FEOC', icon: ShieldAlert },
    { id: 'UFLPA', label: 'UFLPA', icon: AlertTriangle },
    { id: 'CRMA', label: 'EU CRMA', icon: Globe },
    { id: 'Conflict Minerals', label: 'Dodd-Frank 1502', icon: Scale },
    { id: 'ESG Watchlist', label: 'Global ESG Risks', icon: FileText },
    { id: 'Sanctioned Entity', label: 'Sanctioned Entities', icon: ShieldAlert },
    { id: 'High ESG Risk', label: 'High ESG Risk', icon: AlertTriangle }
  ];
  
  const handleSelect = (id: string) => {
    setSearchParams(prev => {
      prev.set('tag', id);
      return prev;
    });
  };

  return (
    <div className={`w-full md:w-80 flex-shrink-0 bg-slate-900/50 border-r border-white/10 flex flex-col h-full overflow-y-auto ${isMobile ? 'h-auto max-h-[40vh] border-b md:border-b-0' : ''}`}>
      <div className="p-4 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-bold text-white mb-4">Risk Frameworks</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search policies or countries..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-2 pb-24 md:pb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Regulatory Tracking</h3>
        {frameworks.map(fw => (
          <button
            key={fw.id}
            onClick={() => handleSelect(fw.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTag === fw.id || (!activeTag && fw.id === 'FEOC')
                ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <fw.icon className="w-4 h-4" />
            {fw.label}
          </button>
        ))}
        
        <div className="pt-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Targeted Entities</h3>
          <div className="space-y-1">
            {['China', 'Russia', 'DRC', 'Iran', 'North Korea'].map(country => (
              <button
                key={country}
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set('country', country);
                    return prev;
                  });
                }}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCountry?.toLowerCase() === country.toLowerCase()
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{country}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
