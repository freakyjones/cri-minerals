interface ChartTooltipPayload {
  color?: string;
  name?: string;
  value?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
}

export default function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="backdrop-blur-md bg-slate-900/90 border border-slate-700/50 rounded-lg px-4 py-3 shadow-glass">
      {label && (
        <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">{label}</p>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color || '#3b82f6' }}
          />
          <span className="text-sm text-slate-300">
            {entry.name}:
          </span>
          <span className="text-sm font-bold text-white">
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
}
