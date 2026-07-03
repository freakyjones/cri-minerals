import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMarketAlert, useMarkAlertAsRead } from '../hooks/useMarketAlerts';
import { useAuthStore } from '../../../stores/useAuthStore';
import { AlertTriangle, AlertCircle, Info, Bell, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle };
    case 'HIGH':
      return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertCircle };
    case 'MEDIUM':
      return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Info };
    default:
      return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Bell };
  }
};

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: alert, isLoading: loading, error } = useMarketAlert(id || '');
  const { mutate: markAsRead } = useMarkAlertAsRead();

  useEffect(() => {
    if (alert && user && id) {
      // Check if not already read
      const isRead = alert.user_alert_reads && alert.user_alert_reads.length > 0;
      if (!isRead) {
        markAsRead({ alertId: id, userId: user.id });
      }
    }
  }, [alert, user, id, markAsRead]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-24 bg-bg-surface rounded-lg"></div>
          <div className="h-12 w-3/4 bg-bg-surface rounded-xl"></div>
          <div className="h-4 w-1/4 bg-bg-surface rounded"></div>
          <div className="h-64 bg-bg-surface rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-6" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Alert Not Found</h2>
        <p className="text-text-secondary mb-8">The alert you're looking for doesn't exist or you don't have permission to view it.</p>
        <button 
          onClick={() => navigate('/alerts')}
          className="px-6 py-3 bg-bg-surface border border-border-light rounded-xl hover:bg-bg-highlight transition-colors"
        >
          Back to Alerts
        </button>
      </div>
    );
  }

  const config = getSeverityConfig(alert.severity);
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6 h-full min-h-0"
    >
      <Link 
        to="/alerts" 
        className="inline-flex items-center space-x-3 text-slate-400 hover:text-slate-200 transition-colors group shrink-0"
      >
        <span className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-slate-800 border border-slate-700/50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </span>
        <span className="font-medium">Back to Alerts</span>
      </Link>

      <div className={`p-6 md:p-10 rounded-2xl border ${config.border} bg-slate-800/80 backdrop-blur-md shadow-glass relative flex-1 overflow-y-auto custom-scrollbar`}>
        {/* Background glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 ${config.bg} blur-[100px] rounded-full opacity-50 pointer-events-none`} />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <span className={`font-semibold tracking-wider text-sm ${config.color}`}>
              {alert.severity} ALERT
            </span>
            <span className="text-text-tertiary text-sm ml-auto">
              {new Date(alert.created_at).toLocaleString()}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
            {alert.title}
          </h1>

          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-lg text-text-secondary leading-relaxed">
              {alert.description}
            </p>
          </div>

          {alert.rationale && alert.rationale.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">Intelligence Rationale</h3>
              <ul className="space-y-3">
                {alert.rationale.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-text-secondary">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.bg.split('/')[0]} shrink-0`} />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {alert.affected_minerals && alert.affected_minerals.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border-light">
              <h3 className="text-sm font-semibold tracking-wider text-text-tertiary mb-4 uppercase">
                Affected Minerals
              </h3>
              <div className="flex flex-wrap gap-2">
                {alert.affected_minerals.map((mineral) => (
                  <Link 
                    key={mineral}
                    to={`/mineral/${mineral.toLowerCase()}`}
                    className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-slate-500 transition-colors text-sm font-medium shadow-sm"
                  >
                    {mineral}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
