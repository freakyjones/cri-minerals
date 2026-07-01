/* eslint-disable no-restricted-imports, react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, Loader2, AlertCircle, CheckCircle2, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useSearchStore } from '../../stores/useSearchStore';
 
import { useMarketAlerts } from '../../features/minerals/hooks/useMarketAlerts';
 
import { useMinerals } from '../../features/minerals/hooks/useMineral';
 
import type { MarketAlert } from '../../features/minerals/schema/marketAlertSchema';

interface TopbarProps {
  onMenuClick?: () => void;
}

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (isNaN(diffMs) || diffMs < 0) return 'Just now';
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const severityStyles = {
  CRITICAL: {
    text: 'text-risk-critical',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: <TrendingUp className="w-4 h-4 text-risk-critical shrink-0 mt-0.5" />
  },
  HIGH: {
    text: 'text-risk-high',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: <AlertTriangle className="w-4 h-4 text-risk-high shrink-0 mt-0.5" />
  },
  MEDIUM: {
    text: 'text-risk-medium',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: <ShieldAlert className="w-4 h-4 text-risk-medium shrink-0 mt-0.5" />
  },
  LOW: {
    text: 'text-risk-low',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: <AlertCircle className="w-4 h-4 text-risk-low shrink-0 mt-0.5" />
  }
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { openSearch } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Integrations
  const { alerts, loading: alertsLoading, error: alertsError, refetch } = useMarketAlerts();
  const { minerals } = useMinerals();

  // Local Storage for Read tracking
  const [readAlertIds, setReadAlertIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('read_alert_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Prune read status for stale alerts to prevent infinite local storage growth
  useEffect(() => {
    if (alerts.length > 0) {
      const activeAlertIds = new Set(alerts.map(a => a.id));
       
      setReadAlertIds(prev => {
        const pruned = prev.filter(id => activeAlertIds.has(id));
        if (pruned.length !== prev.length) {
          localStorage.setItem('read_alert_ids', JSON.stringify(pruned));
          return pruned;
        }
        return prev;
      });
    }
  }, [alerts]);

  const unreadAlerts = alerts.filter(alert => !readAlertIds.includes(alert.id));
  const unreadCount = unreadAlerts.length;

  const handleMarkAllRead = () => {
    const allIds = alerts.map(a => a.id);
    setReadAlertIds(allIds);
    localStorage.setItem('read_alert_ids', JSON.stringify(allIds));
  };

  const handleAlertClick = (alertId: string) => {
    if (!readAlertIds.includes(alertId)) {
      const next = [...readAlertIds, alertId];
      setReadAlertIds(next);
      localStorage.setItem('read_alert_ids', JSON.stringify(next));
    }
  };

  // Click Outside and Keydown Listeners (with trigger exclusion bug fix)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="h-16 border-b border-white/10 bg-bg-base/95 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
      <div className="flex-1 flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue rounded-md"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Search Trigger */}
        <button 
          onClick={openSearch}
          className="relative w-full max-w-md hidden sm:block group text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-md"
          aria-label="Open global search"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-accent-blue transition-colors" />
          <div className="w-full bg-slate-900 border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-sm text-slate-500 group-hover:border-white/20 transition-all">
            Search minerals, countries, or uses...
          </div>
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-400 group-hover:text-slate-300 transition-colors">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-accent-blue outline-none relative ${isOpen ? 'bg-white/5 text-white' : ''}`}
          aria-label={`Notifications, ${unreadCount} unread`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-bg-base">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Container */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-96 max-h-[480px] bg-slate-900 border border-white/10 rounded-xl shadow-glass flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/50">
              <h3 className="font-bold text-white text-sm">Market Intelligence Alerts</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-accent-blue hover:text-accent-blue/80 hover:underline transition-colors font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5 min-h-0">
              {alertsLoading ? (
                <div className="p-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-accent-blue" />
                  <span className="text-xs">Fetching active alerts...</span>
                </div>
              ) : alertsError ? (
                <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <p className="text-xs text-slate-400">Failed to load alerts.</p>
                  <button 
                    onClick={() => refetch()} 
                    className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded text-xs transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : alerts.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-600" />
                  <h4 className="text-sm font-semibold text-slate-300">All caught up!</h4>
                  <p className="text-xs text-slate-500">No active alerts at this time.</p>
                </div>
              ) : (
                alerts.map((alert: MarketAlert) => {
                  const style = severityStyles[alert.severity as keyof typeof severityStyles] || severityStyles.LOW;
                  const isRead = readAlertIds.includes(alert.id);
                  return (
                    <div 
                      key={alert.id}
                      onClick={() => handleAlertClick(alert.id)}
                      className={`p-4 transition-colors flex flex-col gap-1 cursor-pointer text-left ${isRead ? 'opacity-65 hover:opacity-100 bg-transparent' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {style.icon}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${style.text} ${style.bg} ${style.border}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                          {getRelativeTime(alert.created_at)}
                        </span>
                      </div>
                      
                      <h4 className={`text-xs font-semibold mt-1 transition-colors ${isRead ? 'text-slate-300' : 'text-white'}`}>
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {alert.description}
                      </p>

                      {/* Mineral Badges Mapping */}
                      {alert.affected_minerals && alert.affected_minerals.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {alert.affected_minerals.map(name => {
                            const mineral = minerals.find(m => m.name.toLowerCase() === name.toLowerCase());
                            if (mineral) {
                              return (
                                <Link
                                  key={mineral.id}
                                  to={`/mineral/${mineral.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-colors"
                                  style={{ borderLeft: `2.5px solid ${mineral.color}` }}
                                >
                                  {mineral.symbol}
                                </Link>
                              );
                            }
                            return (
                              <span key={name} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400">
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-center shrink-0 bg-slate-900/50">
              <Link 
                to="/alerts" 
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                View alert history ({alerts.length})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
