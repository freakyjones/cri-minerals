import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  useMineral, 
  MineralPageHeader, 
  PrimaryApplications, 
  SummaryStats, 
  EsgAlertCard,
  MineralTimeline,
  GeopoliticsSection
} from '../features/minerals';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { ErrorState } from '../components/ui/ErrorState';
import { SEO } from '../components/SEO';

const pageVariantsFull = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function MineralPage() {
  const { slug } = useParams();
  const { mineral, loading, error, refetch } = useMineral(slug);
  const pageVariants = useAccessibleVariants(pageVariantsFull);

  if (loading) {
    return (
      <div className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
        <div className="animate-pulse bg-bg-surface h-6 w-32 rounded shadow-glass mb-8"></div>
        <div className="animate-pulse bg-bg-surface h-20 w-3/4 md:w-1/2 rounded-xl shadow-glass mb-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="space-y-8 lg:col-span-1">
             <div className="animate-pulse bg-bg-surface h-64 rounded-xl shadow-glass"></div>
           </div>
           <div className="lg:col-span-2">
             <div className="animate-pulse bg-bg-surface h-96 rounded-xl shadow-glass"></div>
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <ErrorState error={error} onRetry={refetch} title="Failed to load mineral data" />
      </div>
    );
  }

  if (!mineral) {
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl text-red-500">Mineral not found</h1>
        <Link to="/" className="text-accent-blue hover:underline mt-4 inline-block focus-visible:ring-2 focus-visible:ring-accent-blue rounded">&larr; Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <>
    <SEO title={`${mineral.name} Intelligence | CriMinerals`} description={mineral.tagline} />
    <motion.div 
      className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Link
        to="/"
        className="text-slate-400 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue rounded px-1"
        onMouseEnter={() => import('./HomePage')}
        onFocus={() => import('./HomePage')}
      >
        &larr; Back to Dashboard
        <kbd className="text-xs bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-slate-500 ml-1">Esc</kbd>
      </Link>
      
      <MineralPageHeader mineral={mineral} />
      <SummaryStats mineral={mineral} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Usage */}
        <div className="space-y-8 lg:col-span-1">
          <PrimaryApplications useCases={mineral.useCases} />
          <div id="esg-alerts" className="scroll-mt-24">
            <EsgAlertCard mineral={mineral} />
          </div>
          {mineral.timeline && mineral.timeline.length > 0 && (
            <MineralTimeline timeline={mineral.timeline} color={mineral.color} />
          )}
          
          <div className="text-xs text-slate-500 bg-bg-surface border border-white/5 p-4 rounded-card">
            <p className="mb-2 font-bold text-slate-400">Data Sources:</p>
            <ul className="list-disc pl-4 space-y-1">
              {mineral.dataSources.map((ds, i) => (
                <li key={i}><a href={ds.url} target="_blank" rel="noreferrer" className="hover:underline hover:text-accent-blue focus-visible:ring-2 focus-visible:ring-accent-blue rounded">{ds.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Right Column - Geopolitics & Supply Chain */}
        <GeopoliticsSection mineral={mineral} />
      </div>
    </motion.div>
    </>
  );
}
