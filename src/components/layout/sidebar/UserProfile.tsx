export default function UserProfile() {
  return (
    <div className="p-4 border-t border-white/10 shrink-0 w-64">
      <div className="flex items-center gap-3 px-1.5">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
          JD
        </div>
        <div className="flex-1 min-w-0 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 whitespace-nowrap">
          <p className="text-sm font-medium text-white truncate">Jane Doe</p>
          <p className="text-xs text-slate-500 truncate">Enterprise Plan</p>
        </div>
      </div>
    </div>
  );
}
