import { motion } from 'framer-motion';
import { useMineralDashboard, MineralCard } from '../features/minerals';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
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
        <p className="text-lg text-gray-400">Monitoring global supply chains, choke points, and market dominance.</p>
        <p className="text-xs text-gray-600 mt-4 uppercase tracking-widest">Data for illustrative purposes only. Sources: USGS, IEA, World Bank.</p>
      </header>

      {/* Risk Heatmap Strip */}
      {!loading && (
        <div className="flex items-center gap-6 mb-8 p-4 bg-bg-surface border border-white/10 rounded-xl shadow-glass">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Risk Overview</span>
          <div className="flex items-center gap-4">
            {riskCounts.CRITICAL > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <span className="text-sm font-bold text-red-400">{riskCounts.CRITICAL}</span>
                <span className="text-xs text-slate-500">Critical</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-sm font-bold text-orange-400">{riskCounts.HIGH}</span>
              <span className="text-xs text-slate-500">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="text-sm font-bold text-yellow-400">{riskCounts.MEDIUM}</span>
              <span className="text-xs text-slate-500">Medium</span>
            </div>
            {riskCounts.LOW > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="text-sm font-bold text-green-400">{riskCounts.LOW}</span>
                <span className="text-xs text-slate-500">Low</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              activeCategory === cat.value
                ? 'bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20'
                : 'bg-bg-surface text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
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
