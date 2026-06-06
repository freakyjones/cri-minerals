import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';

const getRiskColor = (score: string) => {
  if (score === 'HIGH') return 'bg-risk-high hover:bg-risk-high/80';
  if (score === 'MEDIUM') return 'bg-risk-medium hover:bg-risk-medium/80';
  return 'bg-risk-low hover:bg-risk-low/80';
};

interface MineralCardProps {
  mineral: Mineral;
  variants?: any;
}

export default function MineralCard({ mineral, variants }: MineralCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/mineral/${mineral.slug}`)}
      className="cursor-pointer h-full"
      layoutId={`card-container-${mineral.slug}`}
    >
      <Card className="h-full bg-bg-surface border-white/10 hover:bg-bg-surface-hover transition-colors shadow-glass overflow-hidden flex flex-col items-start p-6 relative border-t-4" style={{ borderTopColor: mineral.color }}>
        <div className="flex justify-between w-full mb-4 z-10 items-start">
          <motion.span 
            layoutId={`symbol-${mineral.slug}`}
            className="text-4xl font-bold" 
            style={{ color: mineral.color }}
          >
            {mineral.symbol}
          </motion.span>
          <motion.div layoutId={`risk-${mineral.slug}`}>
             <Badge className={`${getRiskColor(mineral.riskScore)} text-white border-none font-bold tracking-wider rounded-md`}>
              {mineral.riskScore}
             </Badge>
          </motion.div>
        </div>
        
        <motion.h2 layoutId={`name-${mineral.slug}`} className="text-2xl font-bold z-10 text-white">
          {mineral.name}
        </motion.h2>
        <p className="text-sm text-gray-400 mt-2 z-10 line-clamp-2">
          {mineral.tagline}
        </p>
      </Card>
    </motion.div>
  );
}
