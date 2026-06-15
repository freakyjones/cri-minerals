import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type UserRole = Database['public']['Enums']['user_role'];

interface AuthState {
  session: Session | null;
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  isInitialized: boolean;
  initializeAuth: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: 'user',
  isLoading: true,
  isInitialized: false,

  initializeAuth: () => {
    if (get().isInitialized) return;

    supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        let userRole: UserRole = 'user';
        if (newSession?.user) {
          userRole = (newSession.user.app_metadata?.role as UserRole) || 'user';
        }
        
        set({
          session: newSession,
          user: newSession?.user ?? null,
          role: userRole,
          isLoading: false
        });
      }
    );

    set({ isInitialized: true });
  },

  signOut: async () => {
    await supabase.auth.signOut();
  }
}));
