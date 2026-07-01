/* eslint-disable no-restricted-imports */
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import NotificationItem from './NotificationItem';
import type { MarketAlert } from '../../../features/minerals/schema/marketAlertSchema';
import type { Mineral } from '../../../features/minerals/schema/mineralSchema';

interface NotificationDropdownProps {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  alerts: MarketAlert[];
  readAlertIds: string[];
  alertsLoading: boolean;
  alertsError: Error | null;
  minerals: Mineral[];
  unreadCount: number;
  handleMarkAllRead: () => void;
  handleAlertClick: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

export default function NotificationDropdown({
  dropdownRef,
  alerts,
  readAlertIds,
  alertsLoading,
  alertsError,
  minerals,
  unreadCount,
  handleMarkAllRead,
  handleAlertClick,
  setIsOpen,
  refetch
}: NotificationDropdownProps) {
  return (
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
              onClick={refetch} 
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        ) : alerts.filter(a => !readAlertIds.includes(a.id)).length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-300">All caught up!</h4>
            <p className="text-xs text-slate-500">No active alerts at this time.</p>
          </div>
        ) : (
          alerts
            .filter(a => !readAlertIds.includes(a.id))
            .slice(0, 5)
            .map((alert) => {
              const isRead = readAlertIds.includes(alert.id);
              return (
                <NotificationItem
                  key={alert.id}
                  alert={alert}
                  isRead={isRead}
                  minerals={minerals}
                  onAlertClick={handleAlertClick}
                  onLinkClick={() => setIsOpen(false)}
                />
              );
            })
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="p-3 border-t border-white/10 text-center shrink-0 bg-slate-900/50">
          <Link 
            to="/alerts" 
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            View alert history ({alerts.length})
          </Link>
        </div>
      )}
    </div>
  );
}
