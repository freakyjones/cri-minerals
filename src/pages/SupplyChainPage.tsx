import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { SimulatedEvent } from '../features/supply-chain/components/SupplyChainSimulator';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function SupplyChainPage() {
  const { filteredMinerals, loading, error, refetch } = useMineralDashboard();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // URL-Based State Management
  const mineralId = searchParams.get('mineral');
  const selectedMineral = filteredMinerals.find(m => m.id === mineralId) || null;
  
  const setSelectedMineral = (mineral: Mineral | null) => {
    setSearchParams(prev => {
      if (mineral) prev.set('mineral', mineral.id);
      else prev.delete('mineral');
      return prev;
    }, { replace: true });
  };

  const showTradeFlows = searchParams.get('flows') !== 'false'; // default true
  const setShowTradeFlows = (val: boolean) => setSearchParams(prev => { prev.set('flows', String(val)); return prev; }, { replace: true });

  const showChokePoints = searchParams.get('choke') !== 'false'; // default true
  const setShowChokePoints = (val: boolean) => setSearchParams(prev => { prev.set('choke', String(val)); return prev; }, { replace: true });

  const showCompliance = searchParams.get('compliance') === 'true'; // default false
  const setShowCompliance = (val: boolean) => setSearchParams(prev => { prev.set('compliance', String(val)); return prev; }, { replace: true });
  
  // Simulator State
  const [simulatedEvent, setSimulatedEvent] = useState<SimulatedEvent>(null);

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
          showCompliance={showCompliance}
          setShowCompliance={setShowCompliance}
          isMobile={isMobile}
        />

        <SupplyChainMapArea 
          selectedMineral={selectedMineral}
          showTradeFlows={showTradeFlows}
          showChokePoints={showChokePoints}
          showCompliance={showCompliance}
          simulatedEvent={simulatedEvent}
        />

        <SupplyChainAnalytics 
          selectedMineral={selectedMineral}
          isMobile={isMobile}
          showCompliance={showCompliance}
          simulatedEvent={simulatedEvent}
          setSimulatedEvent={setSimulatedEvent}
        />
      </motion.div>
    </>
  );
}
