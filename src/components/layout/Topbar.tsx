import { Search, Bell, Menu } from 'lucide-react';
import { useSearchStore } from '../../stores/useSearchStore';
import { useTopbarNotifications } from './topbar/useTopbarNotifications';
import NotificationDropdown from './topbar/NotificationDropdown';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { openSearch } = useSearchStore();
  const {
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
  } = useTopbarNotifications();

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
          <NotificationDropdown
            dropdownRef={dropdownRef}
            alerts={alerts}
            readAlertIds={readAlertIds}
            alertsLoading={alertsLoading}
            alertsError={alertsError}
            minerals={minerals}
            unreadCount={unreadCount}
            handleMarkAllRead={handleMarkAllRead}
            handleAlertClick={handleAlertClick}
            setIsOpen={setIsOpen}
            refetch={refetch}
          />
        )}
      </div>
    </header>
  );
}
