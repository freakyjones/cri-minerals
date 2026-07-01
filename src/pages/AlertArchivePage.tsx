import { motion } from 'framer-motion';
import { useMarketAlerts, useSemanticSearch } from '../features/minerals/hooks/useMarketAlerts';
import { AlertTriangle, TrendingUp, ShieldAlert, AlertCircle, ArrowLeft, Search } from 'lucide-react';
import { useAccessibleVariants } from '../lib/useAccessibleVariants';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const pageVariantsFull = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20 }
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

export default function AlertArchivePage() {
  const { alerts, loading: initialLoading, error: initialError } = useMarketAlerts();
  const { mutate: searchSemantic, isPending: isSearching, data: searchResults, error: semanticError } = useSemanticSearch();
  const pageVariants = useAccessibleVariants(pageVariantsFull);
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleSemanticSearch = () => {
    if (searchTerm.trim()) {
      searchSemantic(searchTerm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSemanticSearch();
    }
  };

  const displayedAlerts = searchResults || alerts.filter(alert => 
    !searchTerm || 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = initialLoading || isSearching;
  const error = initialError || semanticError;

  return (
    <>
      <SEO 
        title="Market Alerts Archive | Critical Minerals Intelligence"
        description="Search and review historical market alerts, supply chain disruptions, and critical mineral geopolitical events."
      />

      <motion.div
        className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col overflow-hidden"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <Link to="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-400 hover:text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Market Alerts Archive</h1>
            <p className="text-slate-400">Search and review historical alerts and market signals.</p>
          </div>
        </div>

        <div className="relative mb-6 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-24 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            placeholder="Search past alerts (e.g., 'copper strike in chile', 'cobalt export ban')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSemanticSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="absolute inset-y-2 right-2 px-4 bg-brand-primary text-slate-900 font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'AI Search'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 mb-6 shrink-0">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-400">Error</h3>
              <p className="text-sm text-red-300 mt-1">{error.message}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 min-h-0 pb-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="h-5 bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))
          ) : displayedAlerts.length === 0 ? (
            <div className="p-12 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No alerts found</h3>
              <p className="text-slate-400">Try adjusting your search terms.</p>
              {searchResults && (
                <button 
                  onClick={() => { 
                    setSearchTerm(''); 
                    searchSemantic('');
                  }}
                  className="mt-4 px-4 py-2 text-brand-primary hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            displayedAlerts.map((alert: any) => (
              <motion.div
                key={alert.id}
                variants={itemVariants}
                className="p-6 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all flex gap-4"
              >
                <div className="mt-1">
                  {alert.severity === 'CRITICAL' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : alert.severity === 'HIGH' ? (
                    <ShieldAlert className="w-5 h-5 text-orange-500" />
                  ) : alert.severity === 'MEDIUM' ? (
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      alert.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                    {searchResults && (
                      <span className="text-xs text-brand-primary/80 ml-auto flex items-center gap-1">
                        <Search className="w-3 h-3" /> AI Match
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{alert.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{alert.description}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
