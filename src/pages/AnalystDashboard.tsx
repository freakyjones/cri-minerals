import AnalystQueue from '../features/minerals/components/AnalystQueue';
import { SEO } from '../components/SEO';
import { useTriggerAlerts } from '../features/minerals/hooks/useMarketAlerts';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function AnalystDashboard() {
  const triggerAlerts = useTriggerAlerts();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrigger = async () => {
    setErrorMsg(null);
    try {
      await triggerAlerts.mutateAsync();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch latest news');
    }
  };

  return (
    <>
    <SEO title="Analyst Queue | CriMinerals" description="Review AI-generated market alerts before they are published to the main dashboard." />
    <div className="h-full w-full overflow-y-auto scroll-smooth custom-scrollbar">
      <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
        <header className="mb-12 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Analyst Review Queue
            </h1>
            <p className="text-white/60 max-w-2xl text-lg">
              Review AI-generated market alerts before they are published to the main dashboard. 
              The pipeline drafts these alerts daily from industry RSS feeds.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={handleTrigger}
              disabled={triggerAlerts.isPending}
              className="px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium rounded-xl border border-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${triggerAlerts.isPending ? 'animate-spin' : ''}`} />
              {triggerAlerts.isPending ? 'Fetching Latest News...' : 'Fetch Latest News'}
            </button>
            {errorMsg && (
              <span className="text-red-400 text-sm">{errorMsg}</span>
            )}
          </div>
        </header>

        <section>
          <AnalystQueue />
        </section>
      </div>
    </div>
    </>
  );
}
