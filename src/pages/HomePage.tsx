import { motion } from 'framer-motion';
import { useMineralDashboard } from '../features/minerals';
import RiskHeatmap from '../features/minerals/components/RiskHeatmap';
import CategoryFilter from '../features/minerals/components/CategoryFilter';
import MineralTable from '../features/minerals/components/MineralTable';
import MineralListMobile from '../features/minerals/components/MineralListMobile';
import MarketAlerts from '../features/minerals/components/MarketAlerts';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { useIsMobile } from '../hooks/useIsMobile';
import { ErrorState } from '../components/ui/ErrorState';
import { SEO } from '../components/SEO';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function HomePage() {
  const { 
    loading, 
    error,
    activeCategory, 
    setActiveCategory, 
    filteredMinerals, 
    riskCounts,
    categories,
    activeRisk,
    setActiveRisk,
    refetch
  } = useMineralDashboard();

  const isMobile = useIsMobile();
  const pageVariants = useAccessibleVariants(pageVariantsFull);

  if (error) {
    return (
      <div className="h-full w-full p-8 flex items-center justify-center">
        <ErrorState error={error} onRetry={refetch} title="Failed to load dashboard" />
      </div>
    );
  }

  return (
    <>
    <SEO title="Overview Dashboard | CriMinerals" description="Monitoring 20 critical minerals across global supply chains, choke points, and geopolitical risks." />
    <motion.div 
      className="h-full p-6 md:p-8 w-full flex flex-col overflow-y-auto custom-scrollbar"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">Critical Minerals Intelligence</h1>
        <p className="text-base text-slate-400">Monitoring 20 critical minerals across global supply chains, choke points, and geopolitical risks.</p>
        <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest">Data for illustrative purposes only. Sources: USGS, IEA, World Bank.</p>
      </header>

      <div className="shrink-0 mb-6">
        <RiskHeatmap 
          riskCounts={riskCounts} 
          activeRisk={activeRisk}
          onRiskClick={setActiveRisk}
          loading={loading}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-4 shrink-0">
            <div className="overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          <div className="pb-8">
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
        </div>
        
        <div className="w-full lg:w-80 shrink-0 hidden lg:block pb-8">
          <MarketAlerts />
        </div>
      </div>
    </motion.div>
    </>
  );
}
