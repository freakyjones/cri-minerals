import { Link, useLocation } from 'react-router-dom';
import { NavItemConfig, preloadRoute } from './navigation.config';

interface NavItemProps {
  item: NavItemConfig;
  onClose?: () => void;
  badge?: React.ReactNode;
}

export default function NavItem({ item, onClose, badge }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <Link
      to={item.disabled ? '#' : item.path}
      className={`flex items-center gap-4 px-2.5 py-2.5 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent-blue outline-none ${
        isActive 
          ? 'bg-accent-blue/10 text-accent-blue font-medium' 
          : item.disabled
            ? 'text-slate-600 cursor-not-allowed'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
      onClick={(e) => {
        if (item.disabled) e.preventDefault();
        else onClose?.();
      }}
      onMouseEnter={() => preloadRoute(item.path)}
      onFocus={() => preloadRoute(item.path)}
      aria-disabled={item.disabled}
      aria-current={isActive ? 'page' : undefined}
      title={item.name}
    >
      {Icon && <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent-blue' : 'text-slate-500'}`} />}
      <span className="flex-1 whitespace-nowrap transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">{item.name}</span>
      {item.disabled && <span className="ml-auto text-[10px] uppercase bg-white/5 text-slate-500 px-1.5 py-0.5 rounded shrink-0 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">Soon</span>}
      {badge && <span className="ml-auto transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">{badge}</span>}
    </Link>
  );
}
