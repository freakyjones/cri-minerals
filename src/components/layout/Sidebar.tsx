import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import MineralIndexAccordion from './MineralIndexAccordion';
import NavItem from './sidebar/NavItem';
import UserProfile from './sidebar/UserProfile';
import { navItems, preloadRoute } from './sidebar/navigation.config';
// eslint-disable-next-line no-restricted-imports
import { useAuth } from '../../features/auth/contexts/AuthContext';

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobileMenuOpen, onClose }: SidebarProps) {
  const { role } = useAuth();
  
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
      {/* Desktop spacer to prevent layout shift */}
      <div className="hidden md:block w-16 flex-shrink-0 h-screen"></div>
      
      {/* Sidebar overlay */}
      <aside className={`fixed top-0 left-0 z-50 border-r border-white/10 bg-bg-base/95 backdrop-blur flex flex-col flex-shrink-0 h-screen transition-all duration-300 ease-in-out group overflow-x-hidden ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-16 md:hover:w-64'}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0 w-64">
          <Link 
            to="/" 
            className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-blue rounded outline-none" 
            onClick={onClose}
            onMouseEnter={() => preloadRoute('/')}
            onFocus={() => preloadRoute('/')}
          >
            <span className="w-6 h-6 shrink-0 rounded bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center text-xs">C</span>
            <div className="transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 whitespace-nowrap">
              Minerals<span className="text-accent-blue font-light">Intel</span>
            </div>
          </Link>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden hide-scrollbar w-64">
          <p className="px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 whitespace-nowrap">Core Intelligence</p>
          <div className="px-3 space-y-1">
            {navItems.filter(item => item.path !== '/analyst' || role === 'admin').map((item) => {
              if (item.isAccordion) {
                return (
                  <div key={item.name}>
                    <MineralIndexAccordion />
                  </div>
                );
              }

              return (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClose={onClose} 
                />
              );
            })}
          </div>
        </nav>

        <UserProfile />
      </aside>
    </>
  );
}
