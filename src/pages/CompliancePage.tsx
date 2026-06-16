import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { SEO } from '../components/SEO';
import { useIsMobile } from '../hooks/useIsMobile';
import ComplianceSidebar from '../features/compliance/components/ComplianceSidebar';
import ComplianceMainArea from '../features/compliance/components/ComplianceMainArea';

const pageVariantsFull = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function CompliancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const pageVariants = useAccessibleVariants(pageVariantsFull);

  const activeTag = searchParams.get('tag') || null;
  const activeCountry = searchParams.get('country') || null;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen w-full overflow-hidden bg-slate-950"
    >
      <SEO 
        title="ESG & Compliance | MineralsIntel" 
        description="Global supply chain compliance, FEOC tracking, and ESG risk assessment."
      />
      
      <ComplianceSidebar 
        activeTag={activeTag}
        activeCountry={activeCountry}
        setSearchParams={setSearchParams}
        isMobile={isMobile}
      />
      
      <ComplianceMainArea 
        activeTag={activeTag}
        activeCountry={activeCountry}
        isMobile={isMobile}
      />
    </motion.div>
  );
}
