import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import mineralsData from '../../data/minerals.json';

export default function CommandPalette() {
  const { isOpen, closeSearch, toggleSearch } = useSearch();
  const navigate = useNavigate();

  // Toggle the menu when ⌘K / Ctrl K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleSearch]);

  return (
    <Command.Dialog 
      open={isOpen} 
      onOpenChange={closeSearch}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-bg-base/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 shadow-glass rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <Command.Input 
            autoFocus
            placeholder="Search minerals, symbols, or categories..." 
            className="w-full bg-transparent text-white placeholder-slate-500 p-4 outline-none border-none text-base"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-smooth">
          <Command.Empty className="py-6 text-center text-slate-500 text-sm">
            No results found.
          </Command.Empty>

          <Command.Group heading="Minerals" className="text-xs font-medium text-slate-500 px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5">
            {mineralsData.map((mineral) => (
              <Command.Item
                key={mineral.id}
                value={`${mineral.name} ${mineral.symbol} ${mineral.category}`}
                onSelect={() => {
                  navigate(`/mineral/${mineral.slug}`);
                  closeSearch();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-slate-300 transition-colors"
              >
                <div className="w-8 h-8 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm">
                  {mineral.symbol}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white">{mineral.name}</span>
                  <span className="text-xs text-slate-400 capitalize">{mineral.category.replace('-', ' ')}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
