/* eslint-disable no-restricted-imports */
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';
import type { MarketAlert } from '../../../features/minerals/schema/marketAlertSchema';
import type { Mineral } from '../../../features/minerals/schema/mineralSchema';

interface NotificationItemProps {
  alert: MarketAlert;
  isRead: boolean;
  minerals: Mineral[];
  onAlertClick: (id: string) => void;
  onLinkClick: () => void;
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
    icon: <ShieldAlert className="w-4 h-4 text-risk-critical shrink-0 mt-0.5" />
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
    icon: <AlertCircle className="w-4 h-4 text-risk-medium shrink-0 mt-0.5" />
  },
  LOW: {
    text: 'text-risk-low',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: <TrendingUp className="w-4 h-4 text-risk-low shrink-0 mt-0.5" />
  }
};

export default function NotificationItem({
  alert,
  isRead,
  minerals,
  onAlertClick,
  onLinkClick
}: NotificationItemProps) {
  const style = severityStyles[alert.severity as keyof typeof severityStyles] || severityStyles.LOW;

  return (
    <div 
      onClick={() => onAlertClick(alert.id)}
      className={`p-4 transition-colors flex flex-col gap-1 cursor-pointer text-left ${
        isRead ? 'opacity-65 hover:opacity-100 bg-transparent' : 'bg-white/[0.02] hover:bg-white/[0.04]'
      }`}
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
                  onClick={onLinkClick}
                  className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-colors border-l-[2.5px]"
                  style={{ borderLeftColor: mineral.color }}
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
}
