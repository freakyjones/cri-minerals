import { Search, Bell, Download } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-bg-base/95 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex-1 flex items-center">
        {/* Search Placeholder */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search minerals, countries, or uses..." 
            className="w-full bg-slate-900 border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
            disabled
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-400">Ctrl K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue outline-none disabled:opacity-50" disabled>
          <Bell className="h-4 w-4" />
        </button>
        <button className="hidden sm:flex items-center gap-2 border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue outline-none disabled:opacity-50" disabled>
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>
    </header>
  );
}
