import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Loader2, Mail, Shield, ArrowRight, Lock } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Account created! If you have email verification enabled, check your inbox.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Navigation is handled automatically by GuestRoute when the session state updates
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({
        type: 'error',
        text: err.message || `Failed to authenticate with ${provider}.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-white flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-bg-surface border-r border-white/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-purple-600/10 z-0"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center">
            <span className="text-xl font-bold">C</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">Minerals<span className="text-accent-blue font-light">Intel</span></span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Secure Intelligence for Critical Supply Chains
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Access global data on 20 critical minerals, visualize geopolitical choke points, and analyze ESG risk factors across the entire battery supply chain.
          </p>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} CriMinerals. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center md:text-left md:hidden mb-8 flex justify-center">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center">
               <span className="text-xl font-bold">C</span>
             </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400">
              {isSignUp ? 'Sign up to access intelligence' : 'Sign in to access your dashboard'}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleOAuth('github')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all focus:ring-2 focus:ring-accent-blue outline-none group"
            >
              <Shield className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-base focus:ring-accent-blue outline-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage(null);
                }}
                className="text-sm text-accent-blue hover:text-white transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
