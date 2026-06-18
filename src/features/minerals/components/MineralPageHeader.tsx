import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskColorSolid, getRiskIcon } from '../utils';
import { Download } from 'lucide-react';

interface MineralPageHeaderProps {
  mineral: Mineral;
}

export default function MineralPageHeader({ mineral }: MineralPageHeaderProps) {

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

        {/* Export Report Button */}
        <button 
          className="hidden sm:flex items-center gap-2 bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue outline-none disabled:opacity-50" 
          disabled
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <motion.h1 layoutId={`name-${mineral.slug}`} className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
        {mineral.name}
      </motion.h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">{mineral.tagline}</p>
    </header>
  );
}
