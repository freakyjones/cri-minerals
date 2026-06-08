import { AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

export default function MarketAlerts() {
  return (
    <div className="w-full lg:w-80 space-y-6 hidden lg:block">
      <div className="bg-bg-surface border border-white/10 rounded-xl p-6 shadow-glass h-full">
        <h3 className="font-bold text-white mb-4">Market Alerts</h3>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-risk-critical shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Tungsten Export Controls</p>
                <p className="text-xs text-slate-400">China imposes immediate export limits on tungsten compounds. Expect price volatility.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-risk-high shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Indonesian Nickel Policy</p>
                <p className="text-xs text-slate-400">New environmental regulations may slow down smelter expansions in Q3.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-risk-medium shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Copper Strike Warning</p>
                <p className="text-xs text-slate-400">Union negotiations at Escondida mine stall. 30% probability of disruption.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
