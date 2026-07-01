import { Activity, CheckCircle2, Globe, ShieldAlert } from 'lucide-react';

interface AuthLeftPanelProps {
  isSignUp: boolean;
}

export default function AuthLeftPanel({ isSignUp }: AuthLeftPanelProps) {
  return (
    <div className="hidden md:flex md:w-1/2 bg-bg-surface border-r border-white/10 p-16 flex-col justify-between relative md:h-full md:overflow-y-auto custom-scrollbar">
      {/* Subtle Geometric Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] text-white">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V.5H40" fill="none" stroke="currentColor" strokeWidth="1"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid-pattern)"></rect>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-purple-600/5 z-0"></div>
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center shadow-lg shadow-accent-blue/20">
          <span className="text-xl font-bold">C</span>
        </div>
        <span className="text-2xl font-bold tracking-tight">Minerals<span className="text-accent-blue font-light">Intel</span></span>
      </div>

      <div className="relative z-10 max-w-lg mt-12 mb-auto">
        {!isSignUp ? (
          /* Login Mode: What's New Micro-feed */
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold leading-tight mb-2">
                System Status & Intelligence Feed
              </h1>
              <p className="text-slate-400 text-lg">
                Welcome back. Here is the latest from the global network.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Activity className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Cobalt Supply Chain Analysis</h3>
                  <p className="text-sm text-slate-400 mt-1">Updated 2 hours ago. New chokepoints identified in key transit corridors.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Global Reserves Sync Complete</h3>
                  <p className="text-sm text-slate-400 mt-1">Latest USGS and IEA dataset successfully ingested and verified.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1">
                  <ShieldAlert className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">ESG Risk Factors Recalculated</h3>
                  <p className="text-sm text-slate-400 mt-1">Minor volatility detected in rare earth elements processing regions.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Sign Up Mode: Onboarding Wizard Pitch */
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold leading-tight mb-4">
                Secure Intelligence for Critical Supply Chains
              </h1>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Global Data Visualization</h3>
                  <p className="text-slate-400 mt-1">Access global data on 20 critical minerals and visualize complex geopolitical landscapes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Identify Chokepoints</h3>
                  <p className="text-slate-400 mt-1">Pinpoint vulnerabilities and analyze ESG risk factors across the entire battery supply chain.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Real-time Risk Scoring</h3>
                  <p className="text-slate-400 mt-1">Leverage predictive algorithms to assess upstream supply chain shocks before they hit the market.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative z-10 text-slate-500 text-sm mt-12">
        &copy; {new Date().getFullYear()} MineralsIntel. All rights reserved.
      </div>
    </div>
  );
}
