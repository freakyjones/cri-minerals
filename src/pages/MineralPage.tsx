import { lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  useMineral, 
  MineralPageHeader, 
  PrimaryApplications, 
  ChokePoints, 
  SummaryStats, 
  EsgAlertCard,
  MineralTimeline 
} from '../features/minerals';
import { Card } from '@/components/ui/card';

const ReservesChart = lazy(() => import('../features/minerals/components/ReservesChart'));
const ProductionChart = lazy(() => import('../features/minerals/components/ProductionChart'));
const GlobalMap = lazy(() => import('../features/minerals/components/GlobalMap').then(m => ({ default: m.GlobalMap })));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function MineralPage() {
  const { slug } = useParams();
  const { mineral, loading } = useMineral(slug);

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto flex items-center justify-center">
        <motion.div className="animate-pulse bg-bg-surface h-8 w-32 rounded shadow-glass"></motion.div>
      </div>
    );
  }

  if (!mineral) {
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl text-red-500">Mineral not found</h1>
        <Link to="/" className="text-accent-blue hover:underline mt-4 inline-block">&larr; Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-block transition-colors">&larr; Back to Dashboard</Link>
      
      <MineralPageHeader mineral={mineral} />
      <SummaryStats mineral={mineral} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Usage */}
        <div className="space-y-8 lg:col-span-1">
          <PrimaryApplications useCases={mineral.useCases} />
          <EsgAlertCard mineral={mineral} />
          {mineral.timeline && mineral.timeline.length > 0 && (
            <MineralTimeline timeline={mineral.timeline} color={mineral.color} />
          )}
          
          <div className="text-xs text-gray-500 bg-bg-surface border border-white/5 p-4 rounded-card">
            <p className="mb-2 font-bold text-gray-400">Data Sources:</p>
            <ul className="list-disc pl-4 space-y-1">
              {mineral.dataSources.map((ds, i) => (
                <li key={i}><a href={ds.url} target="_blank" rel="noreferrer" className="hover:underline hover:text-accent-blue">{ds.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Right Column - Geopolitics & Supply Chain */}
        <div className="space-y-8 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
              <h2 className="text-xl font-bold mb-2 text-white">Global Reserves</h2>
              <p className="text-xs text-gray-400 mb-6 border-b border-white/10 pb-2">Where the mineral physically exists in the ground.</p>
              <Suspense fallback={<div className="h-64 w-full flex items-center justify-center text-slate-500 animate-pulse">Loading chart...</div>}>
                <ReservesChart data={mineral.reserves} />
              </Suspense>
            </Card>

            <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
              <h2 className="text-xl font-bold mb-2 text-white">Active Production</h2>
              <p className="text-xs text-gray-400 mb-6 border-b border-white/10 pb-2">Which countries are currently extracting it.</p>
              <Suspense fallback={<div className="h-64 w-full flex items-center justify-center text-slate-500 animate-pulse">Loading chart...</div>}>
                <ProductionChart data={mineral.production} />
              </Suspense>
            </Card>
          </div>

          <div className="w-full">
            <Suspense fallback={<div className="h-[400px] w-full bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 animate-pulse">Loading map...</div>}>
              <GlobalMap mineral={mineral} />
            </Suspense>
          </div>

          <ChokePoints mineral={mineral} />
        </div>
      </div>
    </motion.div>
  );
}
