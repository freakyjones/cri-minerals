import { motion } from 'framer-motion';
import { useMineralDashboard, MineralCard } from '../features/minerals';
import RiskHeatmap from '../features/minerals/components/RiskHeatmap';
import CategoryFilter from '../features/minerals/components/CategoryFilter';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const listVariantsFull = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariantsFull = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const { 
    loading, 
    activeCategory, 
    setActiveCategory, 
    filteredMinerals, 
    riskCounts,
    categories
  } = useMineralDashboard();

  const pageVariants = useAccessibleVariants(pageVariantsFull);
  const listVariants = useAccessibleVariants(listVariantsFull);
  const cardVariants = useAccessibleVariants(cardVariantsFull);

  return (
    <motion.div 
      className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-white">Critical Minerals Intelligence</h1>
        <p className="text-lg text-slate-400">Monitoring 20 critical minerals across global supply chains, choke points, and geopolitical risks.</p>
        <p className="text-xs text-slate-600 mt-4 uppercase tracking-widest">Data for illustrative purposes only. Sources: USGS, IEA, World Bank.</p>
      </header>

      {!loading && (
        <RiskHeatmap riskCounts={riskCounts} />
      )}

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
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
          key={activeCategory}
        >
          {filteredMinerals.map(m => (
            <MineralCard key={m.id} mineral={m} variants={cardVariants} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
