import { useDraftAlerts, usePublishAlert, useRejectAlert } from '../hooks/useMarketAlerts';
import { motion, AnimatePresence } from 'framer-motion';

const severityColors = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/50',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/50',
};

export default function AnalystQueue() {
  const { drafts, loading, error } = useDraftAlerts();
  const publishAlert = usePublishAlert();
  const rejectAlert = useRejectAlert();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-bg-surface h-32 rounded-xl shadow-glass border border-white/5"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-4 bg-red-500/10 rounded-xl border border-red-500/20">Error loading drafts: {error.message}</div>;
  }

  if (drafts.length === 0) {
    return (
      <div className="p-12 text-center bg-bg-surface rounded-xl shadow-glass border border-white/5">
        <h3 className="text-xl font-medium text-white/80 mb-2">Queue is Empty</h3>
        <p className="text-white/50">All AI-generated market alerts have been reviewed. Check back after the next pipeline run.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {drafts.map((alert) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-surface p-6 rounded-xl shadow-glass border border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors"
          >
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-white/40">AI Generated Draft</span>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-white/40">{new Date(alert.created_at).toLocaleString()}</span>
                </div>
                <h3 className="text-lg font-medium text-white/90 mb-2 leading-tight">{alert.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{alert.description}</p>
                
                {/* AI Explainability (XAI) Section */}
                {(alert.confidence_score !== undefined && alert.confidence_score !== null || (alert.rationale && alert.rationale.length > 0)) && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">AI Analysis</span>
                      {alert.confidence_score !== undefined && alert.confidence_score !== null && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alert.confidence_score >= 80 ? 'bg-green-500/20 text-green-400' :
                          alert.confidence_score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {alert.confidence_score}% CONFIDENCE
                        </span>
                      )}
                    </div>
                    {alert.rationale && alert.rationale.length > 0 && (
                      <ul className="space-y-2">
                        {alert.rationale.map((reason, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-400">
                            <span className="text-slate-600 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 min-w-[120px]">
                <button 
                  onClick={() => publishAlert.mutate(alert.id)}
                  disabled={(publishAlert.isPending && publishAlert.variables === alert.id) || (rejectAlert.isPending && rejectAlert.variables === alert.id)}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium text-sm rounded-lg border border-blue-500/30 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {publishAlert.isPending && publishAlert.variables === alert.id ? 'Publishing...' : 'Approve'}
                </button>
                <button 
                  onClick={() => rejectAlert.mutate(alert.id)}
                  disabled={(publishAlert.isPending && publishAlert.variables === alert.id) || (rejectAlert.isPending && rejectAlert.variables === alert.id)}
                  className="px-4 py-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 font-medium text-sm rounded-lg border border-white/10 hover:border-red-500/30 transition-colors disabled:opacity-50"
                >
                  {rejectAlert.isPending && rejectAlert.variables === alert.id ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
