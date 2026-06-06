import { motion } from 'framer-motion';
import { useMinerals } from '../features/minerals/hooks/useMineral';
import MineralCard from '../features/minerals/components/MineralCard';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const { minerals, loading } = useMinerals();

  return (
    <motion.div 
      className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-white">Critical Minerals Intelligence</h1>
        <p className="text-lg text-gray-400">Monitoring global supply chains, choke points, and market dominance.</p>
        <p className="text-xs text-gray-600 mt-4 uppercase tracking-widest">Data for illustrative purposes only. Sources: USGS, IEA, World Bank.</p>
      </header>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-bg-surface rounded-card animate-pulse shadow-glass"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {minerals.map(m => (
            <MineralCard key={m.id} mineral={m} variants={cardVariants} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
