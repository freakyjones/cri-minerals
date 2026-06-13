import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useMinerals } from '@/features/minerals';
import NavAccordion from './sidebar/NavAccordion';

export default function MineralIndexAccordion() {
  const location = useLocation();
  const isMineralRoute = location.pathname.startsWith('/mineral/');
  const [isOpenOverride, setIsOpenOverride] = useState<boolean | null>(null);
  const { minerals } = useMinerals();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsOpenOverride(null);
  }
  
  const isIndexOpen = isOpenOverride !== null ? isOpenOverride : isMineralRoute;

  return (
    <NavAccordion
      name="Minerals Index"
      icon={Compass}
      isOpen={isIndexOpen}
      isActive={isMineralRoute}
      onToggle={() => setIsOpenOverride(!isIndexOpen)}
    >
      {minerals.map(mineral => {
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
    </NavAccordion>
  );
}
