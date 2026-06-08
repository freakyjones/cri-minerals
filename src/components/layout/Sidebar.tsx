import { LayoutDashboard, Compass, Map as MapIcon, ShieldAlert, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Minerals Index', path: '#', icon: Compass, disabled: true },
  { name: 'Supply Chain Map', path: '#', icon: MapIcon, disabled: true },
  { name: 'ESG Watchlist', path: '#', icon: ShieldAlert, disabled: true },
  { name: 'Settings', path: '#', icon: Settings, disabled: true },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-white/10 bg-bg-base/95 backdrop-blur hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-blue rounded outline-none">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center text-xs">C</span>
          Minerals<span className="text-accent-blue font-light">Intel</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Core Intelligence</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
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
              <item.icon className={`h-4 w-4 ${isActive ? 'text-accent-blue' : 'text-slate-500'}`} />
              {item.name}
              {item.disabled && <span className="ml-auto text-[10px] uppercase bg-white/5 text-slate-500 px-1.5 py-0.5 rounded">Soon</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
