import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartTooltip from './ChartTooltip';
import type { Mineral } from '../schema/mineralSchema';

import { CHART_COLORS } from '../utils';
import ErrorBoundary from '../../../components/ErrorBoundary';

interface ProductionChartProps {
  data: Mineral['production'];
}

export default function ProductionChart({ data }: ProductionChartProps) {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="h-64 w-full">
      <ErrorBoundary fallback={<div className="h-full w-full flex items-center justify-center text-slate-500 bg-slate-900/20 rounded text-sm">Failed to load chart</div>}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
            <RechartsTooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={<ChartTooltip />}
            />
            <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={24}>
               {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ErrorBoundary>
    </div>
  );
}
