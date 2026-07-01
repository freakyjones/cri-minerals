import { useState } from 'react';
import { Loader2, Mail, ArrowRight, Lock, CheckCircle2, Zap, Globe, Sparkles } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm';

interface AuthFormProps {
  auth: ReturnType<typeof useAuthForm>;
}

export default function AuthForm({ auth }: AuthFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    toggleSignUpMode,
    loading,
    message,
    handleEmailAuth,
    handleOAuth,
    handleGuestAuth
  } = auth;

  const [activeTab, setActiveTab] = useState<'auth' | 'guest'>('auth');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-bg-base">
      
      {/* Background Radial Glows for Premium Aesthetics */}
      <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} /> {/* eslint-disable-line react/forbid-dom-props */}

      <div className="w-full max-w-md relative z-10">
        
        {/* Mobile Header Logo */}
        <div className="text-center md:hidden mb-4 flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center shadow-lg shadow-accent-blue/20">
            <span className="text-xl font-bold text-white">C</span>
          </div>
        </div>

        {/* Outer Card (Glassmorphism Container) */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 flex flex-col">
          
          {/* Custom Navigation Tab Selector */}
          <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800/60 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('auth')}
              className={`flex-grow py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'auth'
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Member Access
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guest')}
              className={`flex-grow py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'guest'
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
              Guest Access
            </button>
          </div>

          {/* TAB 1: AUTHORIZED LOGIN / SIGNUP */}
          {activeTab === 'auth' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="text-left mb-2">
                <h2 className="text-2xl font-black mb-1.5 tracking-tight text-white">
                  {isSignUp ? 'Create an account' : 'Welcome back'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isSignUp ? 'Register to access global mineral intelligence.' : 'Sign in to access your custom dashboards.'}
                </p>
              </div>

              {/* OAuth Action */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl font-medium text-slate-350 hover:text-white transition-all focus:ring-2 focus:ring-accent-blue outline-none group"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm leading-relaxed border ${
                    message.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/40 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-accent-blue/10 hover:shadow-accent-blue/20 transition-all outline-none mt-2"
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
                
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={toggleSignUpMode}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hover:underline"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: GUEST ACCESS */}
          {activeTab === 'guest' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col justify-between h-full">
              <div className="text-left">
                <h2 className="text-2xl font-black mb-1.5 tracking-tight text-white flex items-center gap-2">
                  Instant Dashboard Access
                </h2>
                <p className="text-sm text-slate-400">
                  Evaluate dashboard features immediately using an anonymous guest profile. No credentials required.
                </p>
              </div>

              {/* Guest Benefits List */}
              <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 space-y-4 my-2">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Global Supply Chain Maps</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Visualize reserves, mines, and refining hubs across 21 minerals.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Interactive Outage Simulator</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Trigger Dijkstra-based trade route detour scenarios in real-time.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Live News Alerts Feed</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Test LLM-parsed geopolitical updates auto-activating on the map.</span>
                  </div>
                </div>
              </div>

              {message && (
                <div className="p-4 rounded-xl text-sm leading-relaxed border bg-red-500/10 text-red-400 border-red-500/20">
                  {message.text}
                </div>
              )}

              <button
                type="button"
                onClick={handleGuestAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-accent-blue to-purple-600 hover:from-accent-blue/95 hover:to-purple-600/95 text-white rounded-xl font-bold shadow-lg shadow-accent-blue/15 hover:shadow-accent-blue/30 transition-all outline-none group text-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Explore Dashboard as Guest
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer info below the card */}
        <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
          By continuing, you agree to our <a href="#" className="text-slate-400 hover:text-white hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-slate-400 hover:text-white hover:underline transition-colors">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}
