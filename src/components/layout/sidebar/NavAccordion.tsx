import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

interface NavAccordionProps {
  name: string;
  icon: LucideIcon;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function NavAccordion({ name, icon: Icon, isOpen, isActive, onToggle, children }: NavAccordionProps) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className={`flex items-center gap-4 px-2.5 py-2.5 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent-blue outline-none w-full text-left ${
          isActive
            ? 'bg-accent-blue/10 text-accent-blue font-medium' 
            : isOpen
              ? 'text-white bg-white/5' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
        aria-expanded={isOpen}
      >
        <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent-blue' : 'text-slate-500'}`} />
        <span className="flex-1 whitespace-nowrap transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">{name}</span>
        <div className="shrink-0 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden md:group-hover:block"
          >
            <div className="pl-10 pr-2 py-2 flex flex-col gap-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
