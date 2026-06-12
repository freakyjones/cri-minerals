import { Popup } from 'react-leaflet';
import { Mineral } from '../../schema/mineralSchema';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface CountryDossierPopupProps {
  country: string;
  mineral: Mineral;
  activeType?: string;
  activeShare?: number;
  activeAmount?: number;
}

const ProgressBar = ({ label, share, color }: { label: string, share: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="text-slate-200 font-bold">{share}%</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${share}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

export default function CountryDossierPopup({
  country,
  mineral,
  activeType,
  activeShare,
  activeAmount,
}: CountryDossierPopupProps) {
  
  const reserves = mineral.reserves.find(r => r.country === country);
  const production = mineral.production.find(p => p.country === country);
  const refining = mineral.refining.find(r => r.country === country);
  const esgAlerts = mineral.esgRisks?.filter(e => e.country === country) || [];
  const chokePoints = mineral.chokePoints.filter(c => c.affectedCountries.includes(country));

  return (
    <Popup className="custom-dark-popup min-w-[260px]" closeButton={false}>
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-1 text-slate-100"
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/50">
          <div className="font-bold text-lg tracking-tight">{country}</div>
          <Badge variant="outline" className="text-[10px] uppercase border-slate-600 bg-slate-800 text-slate-300">
            {mineral.symbol}
          </Badge>
        </div>

        {activeType && activeShare !== undefined && (
          <div className="mb-4 p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80 shadow-inner">
            <div className="text-[10px] font-bold text-accent-blue uppercase tracking-wider mb-1">{activeType} Share</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{activeShare}%</div>
              {activeAmount !== undefined && (
                <div className="text-xs text-slate-400">{activeAmount.toLocaleString()} MT</div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3 mt-2">
          {reserves && <ProgressBar label="Reserves" share={reserves.share} color={mineral.color} />}
          {production && <ProgressBar label="Production" share={production.share} color="#3b82f6" />}
          {refining && <ProgressBar label="Refining" share={refining.share} color="#a855f7" />}
        </div>

        {(esgAlerts.length > 0 || chokePoints.length > 0) && (
          <div className="mt-4 pt-3 border-t border-slate-700/50 space-y-3">
            {esgAlerts.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1.5">
                  ESG Alerts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {esgAlerts.map((esg, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-medium border border-red-500/20">
                      {esg.category} ({esg.severity})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {chokePoints.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block mb-1.5">
                  Choke Points
                </span>
                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                  {chokePoints.map((cp, idx) => (
                    <li key={idx} className="leading-snug">{cp.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Popup>
  );
}
