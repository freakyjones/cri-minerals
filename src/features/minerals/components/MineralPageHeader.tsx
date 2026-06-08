import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskColorSolid, getRiskIcon } from '../utils';
import { useMinerals } from '../hooks/useMineral';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface MineralPageHeaderProps {
  mineral: Mineral;
}

export default function MineralPageHeader({ mineral }: MineralPageHeaderProps) {
  const { minerals } = useMinerals();
  const navigate = useNavigate();

  return (
    <header className="mb-8 border-b border-white/10 pb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.span layoutId={`symbol-${mineral.slug}`} className="text-4xl md:text-5xl font-bold text-slate-200">
            {mineral.symbol}
          </motion.span>
          <motion.div layoutId={`risk-${mineral.slug}`}>
            <Badge className={`${getRiskColorSolid(mineral.riskScore)} border-none font-bold tracking-wider rounded-md`}>
              {getRiskIcon(mineral.riskScore)} {mineral.riskScore} RISK
            </Badge>
          </motion.div>
          <Badge variant="outline" className="text-gray-400 border-gray-700 uppercase">
            {mineral.category}
          </Badge>
        </div>

        {/* Quick-Switch Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-md px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors">
            Switch Mineral <ChevronDown className="h-4 w-4" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden group-focus-within:opacity-100 group-focus-within:visible">
            <div className="max-h-96 overflow-y-auto py-1">
              {minerals.map(m => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/mineral/${m.slug}`)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-white/5 focus:outline-none focus:bg-white/5 ${m.id === mineral.id ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-slate-300'}`}
                >
                  <span>{m.name}</span>
                  <span className="text-xs text-slate-500">{m.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <motion.h1 layoutId={`name-${mineral.slug}`} className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
        {mineral.name}
      </motion.h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">{mineral.tagline}</p>
    </header>
  );
}
