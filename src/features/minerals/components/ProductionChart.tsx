import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Mineral } from '../schema/mineralSchema';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

interface ProductionChartProps {
  data: Mineral['production'];
}

export default function ProductionChart({ data }: ProductionChartProps) {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
          <RechartsTooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#080d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            formatter={(value) => [`${value}%`, 'Global Share']}
          />
          <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={24}>
             {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
