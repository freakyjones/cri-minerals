import { AlertTriangle, TrendingUp, ShieldAlert, AlertCircle } from 'lucide-react';
import { useMarketAlerts } from '../hooks/useMarketAlerts';
import { motion } from 'framer-motion';

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return <TrendingUp className="w-5 h-5 text-risk-critical shrink-0 mt-0.5" />;
    case 'HIGH':
      return <AlertTriangle className="w-5 h-5 text-risk-high shrink-0 mt-0.5" />;
    case 'MEDIUM':
      return <ShieldAlert className="w-5 h-5 text-risk-medium shrink-0 mt-0.5" />;
    case 'LOW':
    default:
      return <AlertCircle className="w-5 h-5 text-risk-low shrink-0 mt-0.5" />;
  }
};

export default function MarketAlerts() {
  const { alerts, loading, error, refetch } = useMarketAlerts();

  return (
    <div className="w-full lg:w-80 space-y-6 hidden lg:block h-full">
      <div className="bg-bg-surface border border-white/10 rounded-xl p-6 shadow-glass h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Market Alerts</h3>
          {error && (
            <button onClick={() => refetch()} className="text-xs text-brand-primary hover:underline">
              Retry
            </button>
          )}
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            // Skeleton Loading State
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full shrink-0" />
                    <div className="w-full space-y-2 mt-1">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-2 bg-white/10 rounded w-full" />
                      <div className="h-2 bg-white/10 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-sm text-red-400">Failed to load alerts.</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400">No active alerts at this time.</p>
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={alert.id} 
                className="bg-white/5 border border-white/10 rounded-lg p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{alert.title}</p>
                    <p className="text-xs text-slate-400">{alert.description}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
