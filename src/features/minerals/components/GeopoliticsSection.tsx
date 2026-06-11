import { lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import type { Mineral } from '../schema/mineralSchema';
import ChokePoints from './ChokePoints';

const SharePieChart = lazy(() => import('./SharePieChart'));
const ProductionChart = lazy(() => import('./ProductionChart'));
const GlobalMap = lazy(() => import('./GlobalMap'));

interface GeopoliticsSectionProps {
  mineral: Mineral;
}

export default function GeopoliticsSection({ mineral }: GeopoliticsSectionProps) {
  return (
    <div className="space-y-8 lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
          <h2 className="text-xl font-bold mb-2 text-white">Global Reserves</h2>
          <p className="text-xs text-slate-400 mb-6 border-b border-white/10 pb-2">Where the mineral physically exists in the ground.</p>
          <Suspense fallback={<div className="h-64 w-full flex items-center justify-center text-slate-500 animate-pulse">Loading chart...</div>}>
            <SharePieChart data={mineral.reserves} />
          </Suspense>
        </Card>

        <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
          <h2 className="text-xl font-bold mb-2 text-white">Active Production</h2>
          <p className="text-xs text-slate-400 mb-6 border-b border-white/10 pb-2">Which countries are currently extracting it.</p>
          <Suspense fallback={<div className="h-64 w-full flex items-center justify-center text-slate-500 animate-pulse">Loading chart...</div>}>
            <ProductionChart data={mineral.production} />
          </Suspense>
        </Card>
      </div>

      <div className="w-full">
        <Suspense fallback={<div className="h-[400px] w-full bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 animate-pulse">Loading map...</div>}>
          <GlobalMap mineral={mineral} />
        </Suspense>
      </div>

      <div id="supply-risk" className="scroll-mt-24">
        <ChokePoints mineral={mineral} />
      </div>
    </div>
  );
}
