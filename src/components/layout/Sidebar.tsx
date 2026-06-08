import { LayoutDashboard, Compass, Map as MapIcon, ShieldAlert, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mineralsData from '../../data/minerals.json';

const navItems = [
  { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Minerals Index', path: '#', icon: Compass, isAccordion: true },
  { name: 'Supply Chain Map', path: '#', icon: MapIcon, disabled: true },
  { name: 'ESG Watchlist', path: '#', icon: ShieldAlert, disabled: true },
  { name: 'Settings', path: '#', icon: Settings, disabled: true },
];

export default function Sidebar() {
  const location = useLocation();
  const isMineralRoute = location.pathname.startsWith('/mineral/');
  const [isOpenOverride, setIsOpenOverride] = useState<boolean | null>(null);
  
  const isIndexOpen = isOpenOverride !== null ? isOpenOverride : isMineralRoute;

  return (
    <aside className="w-64 border-r border-white/10 bg-bg-base/95 backdrop-blur hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-blue rounded outline-none">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center text-xs">C</span>
          Minerals<span className="text-accent-blue font-light">Intel</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto hide-scrollbar">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Core Intelligence</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.isAccordion && location.pathname.startsWith('/mineral/'));
          
          if (item.isAccordion) {
            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => setIsOpenOverride(!isIndexOpen)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent-blue outline-none w-full text-left ${
                    isActive || isIndexOpen
                      ? 'bg-accent-blue/10 text-accent-blue font-medium' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-expanded={isIndexOpen}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive || isIndexOpen ? 'text-accent-blue' : 'text-slate-500'}`} />
                  <span className="flex-1">{item.name}</span>
                  {isIndexOpen ? (
                    <ChevronDown className="ml-auto w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="ml-auto w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isIndexOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 pr-2 py-2 flex flex-col gap-1">
                        {mineralsData.map(mineral => {
                          const isMineralActive = location.pathname === `/mineral/${mineral.slug}`;
                          return (
                            <Link
                              key={mineral.id}
                              to={`/mineral/${mineral.slug}`}
                              className={`px-3 py-1.5 rounded-md text-xs transition-colors truncate focus-visible:ring-2 focus-visible:ring-accent-blue outline-none flex items-center gap-2 ${
                                isMineralActive
                                  ? 'bg-accent-blue text-white font-medium shadow-glass'
                                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isMineralActive ? 'bg-white' : 'bg-transparent'}`} />
                              <span className="w-5 inline-block font-bold opacity-50 shrink-0">{mineral.symbol}</span>
                              <span className="truncate">{mineral.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

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
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-accent-blue' : 'text-slate-500'}`} />
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
  );
}
