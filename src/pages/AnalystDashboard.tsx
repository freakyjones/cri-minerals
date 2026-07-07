import AnalystQueue from '../features/minerals/components/AnalystQueue';
import { SEO } from '../components/SEO';
import { useTriggerAlerts } from '../features/minerals/hooks/useMarketAlerts';
import { useAlertQueue } from '../features/minerals/hooks/useAlertQueue';
import { RefreshCw, Info } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function AnalystDashboard() {
  const triggerAlerts = useTriggerAlerts();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const queueStatus = useAlertQueue(activeRunId);

  // New states for UI fixes
  const lastProcessedRunIdRef = useRef<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [prevDraftCount, setPrevDraftCount] = useState<number | null>(null);

  const getDraftCount = useCallback(() => {
    const data = queryClient.getQueryData(['draftAlerts']) as unknown[];
    return data ? data.length : 0;
  }, [queryClient]);

  const handleTrigger = async () => {
    setErrorMsg(null);
    setToastMessage(null);
    setPrevDraftCount(getDraftCount());
    try {
      const res = await triggerAlerts.mutateAsync();
      if (res?.run_id) {
        setActiveRunId(res.run_id);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch latest news');
    }
  };

  useEffect(() => {
    if (
      queueStatus?.status === 'COMPLETED' && 
      activeRunId && 
      activeRunId !== lastProcessedRunIdRef.current &&
      prevDraftCount !== null
    ) {
      lastProcessedRunIdRef.current = activeRunId;
      // Refresh the draft list automatically when background job finishes
      queryClient.invalidateQueries({ queryKey: ['draftAlerts'] }).then(() => {
        const newCount = getDraftCount();
        if (newCount === prevDraftCount) {
          setToastMessage("No significant critical mineral news found today.");
        } else {
          setToastMessage(`Successfully generated ${newCount - prevDraftCount} new alerts!`);
        }
        setPrevDraftCount(null); // Reset to prevent re-triggering

        // Auto-hide toast
        setTimeout(() => { setToastMessage(null); }, 6000);
      }).catch(console.error);
    }
  }, [queueStatus?.status, activeRunId, queryClient, prevDraftCount, getDraftCount]);

  const isGenerating = triggerAlerts.isPending || queueStatus?.status === 'PENDING' || queueStatus?.status === 'IN_PROGRESS';

  // Dynamic button text
  let buttonText = 'Fetch Latest News';
  if (triggerAlerts.isPending) {
    buttonText = 'Starting Job...';
  } else if (queueStatus?.status === 'PENDING') {
    buttonText = 'Waiting in Queue...';
  } else if (queueStatus?.status === 'IN_PROGRESS') {
    buttonText = 'Generating AI Alerts...';
  }

  return (
    <>
    <SEO title="Analyst Queue | CriMinerals" description="Review AI-generated market alerts before they are published to the main dashboard." />
    
    {toastMessage && (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-8 z-50 backdrop-blur-md">
        <Info className="w-5 h-5" />
        <span className="font-medium">{toastMessage}</span>
      </div>
    )}

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
          
          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              onClick={handleTrigger}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium rounded-xl border border-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {buttonText}
            </button>
            {errorMsg && (
              <span className="text-red-400 text-sm mt-1">{errorMsg}</span>
            )}
            {queueStatus?.status === 'FAILED' && (
              <span className="text-red-400 text-sm mt-1">Error: {queueStatus.error_message}</span>
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
