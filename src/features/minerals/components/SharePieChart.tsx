import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import ChartTooltip from './ChartTooltip';
import type { Mineral } from '../schema/mineralSchema';
import { CHART_COLORS } from '../utils';
import ErrorBoundary from '../../../components/ErrorBoundary';

interface SharePieChartProps {
  data: Mineral['reserves'] | Mineral['refining'];
}

export default function SharePieChart({ data }: SharePieChartProps) {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="h-64 w-full">
      <ErrorBoundary fallback={<div className="h-full w-full flex items-center justify-center text-slate-500 bg-slate-900/20 rounded text-sm">Failed to load chart</div>}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="share"
              nameKey="country"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<ChartTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      </ErrorBoundary>
    </div>
  );
}
