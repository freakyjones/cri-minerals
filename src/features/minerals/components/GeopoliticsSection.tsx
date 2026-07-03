import { lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import type { Mineral } from '../schema/mineralSchema';

const SharePieChart = lazy(() => import('./SharePieChart'));
const ProductionChart = lazy(() => import('./ProductionChart'));

interface GeopoliticsSectionProps {
  mineral: Mineral;
}

export default function GeopoliticsSection({ mineral }: GeopoliticsSectionProps) {
  return (
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
  );
}
