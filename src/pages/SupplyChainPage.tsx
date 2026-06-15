import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMineralDashboard } from '../features/minerals';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { ErrorState } from '../components/ui/ErrorState';
import { SEO } from '../components/SEO';
import { Mineral } from '../features/minerals/schema/mineralSchema';
import { useIsMobile } from '../hooks/useIsMobile';

// Extracted Components
import SupplyChainSidebar from '../features/supply-chain/components/SupplyChainSidebar';
import SupplyChainMapArea from '../features/supply-chain/components/SupplyChainMapArea';
import SupplyChainAnalytics from '../features/supply-chain/components/SupplyChainAnalytics';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function SupplyChainPage() {
  const { filteredMinerals, loading, error, refetch } = useMineralDashboard();
  const [selectedMineral, setSelectedMineral] = useState<Mineral | null>(null);
  const isMobile = useIsMobile();
  
  // Layer Toggles shared between Map and Sidebar
  const [showTradeFlows, setShowTradeFlows] = useState(true);
  const [showChokePoints, setShowChokePoints] = useState(true);
  


  const pageVariants = useAccessibleVariants(pageVariantsFull);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-950">
        <ErrorState error={error} onRetry={refetch} title="Failed to load supply chain data" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Supply Chain Intelligence | CriMinerals" description="Enterprise three-pane supply chain mapping and analytics for critical minerals." />
      <motion.div 
        className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-bg-base relative"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SupplyChainSidebar 
          filteredMinerals={filteredMinerals}
          loading={loading}
          selectedMineral={selectedMineral}
          setSelectedMineral={setSelectedMineral}
          showTradeFlows={showTradeFlows}
          setShowTradeFlows={setShowTradeFlows}
          showChokePoints={showChokePoints}
          setShowChokePoints={setShowChokePoints}
          isMobile={isMobile}
        />

        <SupplyChainMapArea 
          selectedMineral={selectedMineral}
          showTradeFlows={showTradeFlows}
          showChokePoints={showChokePoints}
        />

        <SupplyChainAnalytics 
          selectedMineral={selectedMineral}
          isMobile={isMobile}
        />
      </motion.div>
    </>
  );
}
