import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronDown, ChevronRight } from 'lucide-react';
import { useMinerals } from '@/features/minerals';

export default function MineralIndexAccordion() {
  const location = useLocation();
  const isMineralRoute = location.pathname.startsWith('/mineral/');
  const [isOpenOverride, setIsOpenOverride] = useState<boolean | null>(null);
  const { minerals } = useMinerals();
  
  const isIndexOpen = isOpenOverride !== null ? isOpenOverride : isMineralRoute;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpenOverride(!isIndexOpen)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent-blue outline-none w-full text-left ${
          isMineralRoute
            ? 'bg-accent-blue/10 text-accent-blue font-medium' 
            : isIndexOpen
              ? 'text-white bg-white/5' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
        aria-expanded={isIndexOpen}
      >
        <Compass className={`h-4 w-4 shrink-0 ${isMineralRoute ? 'text-accent-blue' : 'text-slate-500'}`} />
        <span className="flex-1">Minerals Index</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
