import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMineral } from '../features/minerals/hooks/useMineral';
import ReservesChart from '../features/minerals/components/ReservesChart';
import ProductionChart from '../features/minerals/components/ProductionChart';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const getRiskColor = (score: string) => {
  if (score === 'CRITICAL' || score === 'HIGH') return 'bg-risk-high text-white';
  if (score === 'MEDIUM') return 'bg-risk-medium text-white';
  return 'bg-risk-low text-white';
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
      
      <header className="mb-12 border-b border-white/10 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <motion.span layoutId={`symbol-${mineral.slug}`} className="text-4xl md:text-5xl font-bold" style={{ color: mineral.color }}>{mineral.symbol}</motion.span>
          <motion.div layoutId={`risk-${mineral.slug}`}>
            <Badge className={`${getRiskColor(mineral.riskScore)} border-none font-bold tracking-wider rounded-md`}>
              {mineral.riskScore} RISK
            </Badge>
          </motion.div>
          <Badge variant="outline" className="text-gray-400 border-gray-700 uppercase">{mineral.category}</Badge>
        </div>
        <motion.h1 layoutId={`name-${mineral.slug}`} className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">{mineral.name}</motion.h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">{mineral.tagline}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Usage */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">Primary Applications</h2>
            <ul className="space-y-4">
              {mineral.useCases.map((uc, i) => (
                <li key={i} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">{uc.label}</span>
                    <span className="font-bold text-accent-blue">{uc.share}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div className="bg-accent-blue h-2 rounded-full" style={{ width: `${uc.share}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          
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
              <ReservesChart data={mineral.reserves} />
            </Card>

            <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
              <h2 className="text-xl font-bold mb-2 text-white">Active Production</h2>
              <p className="text-xs text-gray-400 mb-6 border-b border-white/10 pb-2">Which countries are currently extracting it.</p>
              <ProductionChart data={mineral.production} />
            </Card>
          </div>

          {/* Refining & Choke Points */}
          <Card className="bg-bg-surface border-risk-high/30 p-6 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-risk-high opacity-5 blur-[80px] pointer-events-none"></div>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="text-risk-high">⚠</span> Supply Chain Vulnerabilities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 border-r border-white/10 pr-6">
                <h3 className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">Refining Dominance</h3>
                <ReservesChart data={mineral.refining} /> 
              </div>
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h3 className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">Identified Choke Points</h3>
                {mineral.chokePoints.map((cp, i) => (
                  <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white text-lg">{cp.title}</h4>
                      <Badge className={`${getRiskColor(cp.severity)} border-none uppercase text-xs animate-pulse-glow`}>{cp.severity}</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{cp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-gray-500">Most Affected:</span>
                      {cp.affectedCountries.map((c, j) => (
                        <span key={j} className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
