import { motion } from 'framer-motion';
import { useMineralDashboard } from '../features/minerals';
import RiskHeatmap from '../features/minerals/components/RiskHeatmap';
import CategoryFilter from '../features/minerals/components/CategoryFilter';
import MineralTable from '../features/minerals/components/MineralTable';
import MineralListMobile from '../features/minerals/components/MineralListMobile';
import MarketAlerts from '../features/minerals/components/MarketAlerts';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { useIsMobile } from '../hooks/useIsMobile';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function HomePage() {
  const { 
    loading, 
    activeCategory, 
    setActiveCategory, 
    filteredMinerals, 
    riskCounts,
    categories,
    activeRisk,
    setActiveRisk
  } = useMineralDashboard();

  const isMobile = useIsMobile();
  const pageVariants = useAccessibleVariants(pageVariantsFull);

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
        <RiskHeatmap 
          riskCounts={riskCounts} 
          activeRisk={activeRisk}
          onRiskClick={setActiveRisk}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Intelligence Index</h2>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {loading ? (
            <div className="h-96 bg-bg-surface rounded-card animate-pulse shadow-glass"></div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={`${activeCategory}-${activeRisk}-${isMobile ? 'mobile' : 'desktop'}`}
            >
              {isMobile ? (
                <MineralListMobile minerals={filteredMinerals} />
              ) : (
                <MineralTable minerals={filteredMinerals} />
              )}
            </motion.div>
          )}
        </div>
        
        <MarketAlerts />
      </div>
    </motion.div>
  );
}
