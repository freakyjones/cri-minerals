import { motion } from 'framer-motion';
import PolicyOverviewCard from './PolicyOverviewCard';
import CountryRiskProfile from './CountryRiskProfile';
import MitigationActionCards from './MitigationActionCards';

interface MainAreaProps {
  activeTag: string | null;
  activeCountry: string | null;
  isMobile: boolean;
}

export default function ComplianceMainArea({ activeTag, activeCountry }: MainAreaProps) {
  const currentTag = activeTag || 'FEOC';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-base relative pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ESG & Compliance Intelligence</h1>
          <p className="text-slate-400">Track regulatory exposure, entity risks, and global ESG mandates.</p>
        </header>

        <PolicyOverviewCard activeTag={currentTag} />

        {activeCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <CountryRiskProfile country={activeCountry} activeTag={currentTag} />
            <MitigationActionCards country={activeCountry} activeTag={currentTag} />
          </motion.div>
        )}
        
        {!activeCountry && (
          <div className="bg-slate-900/50 rounded-xl p-8 border border-white/5 text-center shadow-glass">
            <h3 className="text-lg font-medium text-slate-300 mb-2">Select an Entity or Region</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Choose a specific country from the targeted entities list, or click on a node in the Supply Chain Map to view its detailed compliance breakdown and mitigation strategies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
