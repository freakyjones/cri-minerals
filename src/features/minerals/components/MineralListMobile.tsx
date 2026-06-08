import { Link } from 'react-router-dom';
import type { Mineral } from '../schema/mineralSchema';

interface MineralListMobileProps {
  minerals: Mineral[];
}

export default function MineralListMobile({ minerals }: MineralListMobileProps) {
  return (
    <div className="flex flex-col gap-4">
      {minerals.map((mineral) => (
        <Link 
          key={mineral.id}
          to={`/mineral/${mineral.slug}`}
          className="block bg-bg-surface border border-white/5 rounded-xl p-4 shadow-glass hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue outline-none"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-slate-300">
                {mineral.symbol}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{mineral.name}</h3>
                <span className="text-xs text-slate-400 uppercase tracking-wider">{mineral.category.replace('-', ' ')}</span>
              </div>
            </div>
            
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border
              ${mineral.riskScore === 'CRITICAL' ? 'bg-risk-critical/10 text-risk-critical border-risk-critical/20' : ''}
              ${mineral.riskScore === 'HIGH' ? 'bg-risk-high/10 text-risk-high border-risk-high/20' : ''}
              ${mineral.riskScore === 'MEDIUM' ? 'bg-risk-medium/10 text-risk-medium border-risk-medium/20' : ''}
              ${mineral.riskScore === 'LOW' ? 'bg-risk-low/10 text-risk-low border-risk-low/20' : ''}
            `}>
              {mineral.riskScore}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-slate-500 mb-1">Top Producer</p>
              <p className="text-sm text-slate-300 font-medium">{mineral.production[0]?.country || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Top Refiner</p>
              <p className="text-sm text-slate-300 font-medium">{mineral.refining[0]?.country || 'Unknown'}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
