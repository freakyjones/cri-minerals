import { LayoutDashboard, Map as MapIcon, ShieldAlert, Settings, X, Inbox } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MineralIndexAccordion from './MineralIndexAccordion';

const navItems = [
  { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Analyst Queue', path: '/analyst', icon: Inbox },
  { name: 'Minerals Index', path: '#', isAccordion: true },
  { name: 'Supply Chain Map', path: '#', icon: MapIcon, disabled: true },
  { name: 'ESG Watchlist', path: '#', icon: ShieldAlert, disabled: true },
  { name: 'Settings', path: '#', icon: Settings, disabled: true },
];

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobileMenuOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`fixed md:sticky top-0 left-0 z-50 w-64 border-r border-white/10 bg-bg-base/95 backdrop-blur flex flex-col flex-shrink-0 h-screen transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-blue rounded outline-none" onClick={onClose}>
            <span className="w-6 h-6 rounded bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center text-xs">C</span>
            Minerals<span className="text-accent-blue font-light">Intel</span>
          </Link>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto hide-scrollbar">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Core Intelligence</p>
        {navItems.map((item) => {
          if (item.isAccordion) {
            return <MineralIndexAccordion key={item.name} />;
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon!;

          return (
            <Link
              key={item.name}
              to={item.disabled ? '#' : item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent-blue outline-none ${
                isActive 
                  ? 'bg-accent-blue/10 text-accent-blue font-medium' 
                  : item.disabled
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={(e) => item.disabled && e.preventDefault()}
              aria-disabled={item.disabled}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-accent-blue' : 'text-slate-500'}`} />
              <span className="flex-1">{item.name}</span>
              {item.disabled && <span className="ml-auto text-[10px] uppercase bg-white/5 text-slate-500 px-1.5 py-0.5 rounded shrink-0">Soon</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
