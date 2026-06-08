import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskColorSolid, getRiskIcon } from '../utils';

interface MineralCardProps {
  mineral: Mineral;
  variants?: Variants;
}

export default function MineralCard({ mineral, variants }: MineralCardProps) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
      layoutId={`card-container-${mineral.slug}`}
    >
      <Link
        to={`/mineral/${mineral.slug}`}
        className="block h-full focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-card outline-none"
      >
        {/* Dynamic border-top color from data — Rule 2.1.1 exception for data-driven values */}
        <Card className="h-full bg-bg-surface border-white/10 hover:bg-white/[0.06] transition-colors shadow-glass overflow-hidden flex flex-col items-start p-6 relative border-t-4" style={{ borderTopColor: mineral.color }}>
          <div className="flex justify-between w-full mb-4 z-10 items-start">
            <motion.span 
              layoutId={`symbol-${mineral.slug}`}
              className="text-4xl font-bold text-slate-200"
            >
              {mineral.symbol}
            </motion.span>
            <motion.div layoutId={`risk-${mineral.slug}`}>
               <Badge className={`${getRiskColorSolid(mineral.riskScore)} text-white border-none font-bold tracking-wider rounded-md`}>
                {getRiskIcon(mineral.riskScore)} {mineral.riskScore}
               </Badge>
            </motion.div>
          </div>
          
          <motion.h2 layoutId={`name-${mineral.slug}`} className="text-2xl font-bold z-10 text-white">
            {mineral.name}
          </motion.h2>
          <p className="text-sm text-slate-400 mt-2 z-10 line-clamp-2">
            {mineral.tagline}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}
