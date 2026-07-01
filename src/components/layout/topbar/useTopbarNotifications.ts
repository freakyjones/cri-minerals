/* eslint-disable no-restricted-imports, react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { useMarketAlerts } from '../../../features/minerals/hooks/useMarketAlerts';
import { useMinerals } from '../../../features/minerals/hooks/useMineral';

export function useTopbarNotifications() {
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

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    triggerRef,
    alerts,
    minerals,
    alertsLoading,
    alertsError,
    readAlertIds,
    unreadCount,
    handleMarkAllRead,
    handleAlertClick,
    refetch
  };
}
