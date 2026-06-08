export default function MarketAlerts() {
  return (
    <div className="w-full lg:w-80 space-y-6 hidden lg:block">
      <div className="bg-bg-surface border border-white/10 rounded-xl p-6 shadow-glass h-full">
        <h3 className="font-bold text-white mb-4">Market Alerts</h3>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Select a mineral to view detailed ESG alerts and choke point vulnerabilities.</p>
          <div className="h-24 bg-white/5 rounded animate-pulse"></div>
          <div className="h-24 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
