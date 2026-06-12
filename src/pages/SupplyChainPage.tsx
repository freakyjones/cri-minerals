import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMinerals, useMineral } from '../features/minerals/hooks/useMineral';
import SupplyChainGlobe from '../features/supply-chain/components/SupplyChainGlobe';
import { SEO } from '../components/SEO';
import ErrorBoundary from '../components/ErrorBoundary';

function GlobeFallback({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 text-center p-8">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">3D WebGL Not Supported</h3>
      <p className="text-slate-400 max-w-md">
        Your device or browser encountered an error rendering the 3D globe. This feature requires a device with WebGL support.
      </p>
      <p className="text-xs text-slate-500 mt-4 font-mono">{error.message}</p>
    </div>
  );
}

export default function SupplyChainPage() {
  const { minerals, loading: listLoading } = useMinerals();
  const [selectedMineralSlug, setSelectedMineralSlug] = useState<string>('');

  const activeSlug = selectedMineralSlug || (minerals.length > 0 ? minerals[0].slug : undefined);
  const { mineral: selectedMineral, loading: detailLoading } = useMineral(activeSlug);

  const loading = listLoading || detailLoading;

  return (
    <>
      <SEO title="Supply Chain Flows | CriMinerals" description="3D Interactive Supply Chain visualizer for critical minerals." />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] md:h-screen w-full">
        {/* Left Sidebar for Selection */}
        <div className="w-full lg:w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col z-10 shrink-0 md:pt-20">
          <h1 className="text-2xl font-bold text-white mb-2">Supply Chain</h1>
          <p className="text-sm text-slate-400 mb-6">Interactive 3D visualization of global trade flows.</p>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Mineral
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                value={activeSlug || ''}
                onChange={(e) => setSelectedMineralSlug(e.target.value)}
              >
                {minerals.map(m => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {selectedMineral && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedMineral.slug}
              className="mt-2 p-5 bg-slate-800/50 rounded-xl border border-white/5 shadow-glass"
            >
              <h3 className="font-semibold text-white flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line react/forbid-dom-props */}
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: selectedMineral.color }}></div>
                {selectedMineral.name} Flow
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualizing trade arcs from top extraction nations to primary refining hubs. Arc thickness indicates proportional market volume.
              </p>
            </motion.div>
          )}
        </div>

        {/* Right Area for 3D Globe */}
        <div className="flex-1 relative bg-[#000010] overflow-hidden cursor-move">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center text-slate-500 animate-pulse">Initializing WebGL Engine...</div>
          ) : selectedMineral ? (
             <ErrorBoundary fallback={<GlobeFallback error={new Error("WebGL context lost or unsupported on this device")} />}>
               <SupplyChainGlobe mineral={selectedMineral} />
             </ErrorBoundary>
          ) : null}
        </div>
      </div>
    </>
  );
}
