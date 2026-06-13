/* eslint-disable no-restricted-imports */
import { LogOut } from 'lucide-react';
import { useAuth } from '../../../features/auth/contexts/AuthContext';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  
  // Get initials from email or full_name
  const emailPrefix = user?.email?.split('@')[0] || '';
  const initials = emailPrefix.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="p-4 border-t border-white/10 shrink-0 w-64">
      <div className="flex items-center gap-3 px-1.5">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-between gap-2 whitespace-nowrap">
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">{user?.email || 'Guest'}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">Enterprise Plan</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-slate-500 hover:text-white p-1 rounded transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
