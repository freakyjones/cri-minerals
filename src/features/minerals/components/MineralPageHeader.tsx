import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskColorSolid } from '../utils';

interface MineralPageHeaderProps {
  mineral: Mineral;
}

export default function MineralPageHeader({ mineral }: MineralPageHeaderProps) {
  return (
    <header className="mb-8 border-b border-white/10 pb-8">
      <div className="flex items-center gap-4 mb-4">
        <motion.span layoutId={`symbol-${mineral.slug}`} className="text-4xl md:text-5xl font-bold" style={{ color: mineral.color }}>
          {mineral.symbol}
        </motion.span>
        <motion.div layoutId={`risk-${mineral.slug}`}>
          <Badge className={`${getRiskColorSolid(mineral.riskScore)} border-none font-bold tracking-wider rounded-md`}>
            {mineral.riskScore} RISK
          </Badge>
        </motion.div>
        <Badge variant="outline" className="text-gray-400 border-gray-700 uppercase">
          {mineral.category}
        </Badge>
      </div>
      <motion.h1 layoutId={`name-${mineral.slug}`} className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
        {mineral.name}
      </motion.h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">{mineral.tagline}</p>
    </header>
  );
}
