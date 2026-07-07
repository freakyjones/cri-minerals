import { useMemo } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import { Mineral } from '../../minerals/schema/mineralSchema';
import { generateSankeyData } from './SupplyChainFlow.utils';

interface SupplyChainFlowProps {
  mineral: Mineral | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomNode = ({ x, y, width, height, index, payload, containerWidth }: any) => {
  const isOut = x + width + 6 > containerWidth;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle x={x} y={y} width={width} height={height} fill={payload.fill} fillOpacity="1" />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="12"
        fill="#f8fafc"
        fontWeight="bold"
        dominantBaseline="middle"
      >
        {
          payload.name.replace(/Ext:|Ref:|Use:/g, '')
        }
      </text>
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 14}
        fontSize="10"
        fill="#94a3b8"
        dominantBaseline="middle"
      >
        {`${Math.round(payload.value)}%`}
      </text>
    </Layer>
  );
};
export default function SupplyChainFlow({ mineral }: SupplyChainFlowProps) {
  const sankeyData = useMemo(() => {
    return generateSankeyData(mineral);
  }, [mineral]);

  if (!mineral) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 h-full">
        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <p className="text-slate-400">Select a mineral to view flow.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative z-0 h-full bg-slate-950 p-8 flex flex-col animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Global Supply Chain Flow
          </h2>
          <p className="text-sm text-slate-400">Visualizing the concentration risk from extraction to final application.</p>
        </div>
        
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Extraction</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Refining</span>
           <span className="flex items-center gap-1">
             {/* eslint-disable-next-line react/forbid-dom-props */}
             <div className="w-3 h-3 rounded-full" style={{backgroundColor: mineral.color}}></div> Application
           </span>
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={sankeyData}
            node={<CustomNode />}
            nodePadding={20}
            nodeWidth={12}
            link={{ stroke: '#334155', strokeOpacity: 0.3 }}
            margin={{ top: 20, right: 120, bottom: 20, left: 120 }}
          >
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Volume']}
            />
          </Sankey>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
