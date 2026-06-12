import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  title?: string;
  className?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title = "Failed to load data",
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-red-900/10 border border-red-500/20 rounded-xl max-w-md mx-auto text-center ${className}`}>
      <div className="bg-red-500/20 p-3 rounded-full mb-4">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 break-words max-w-full">
        {error.message || 'An unexpected error occurred while fetching data.'}
      </p>
      <button 
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
