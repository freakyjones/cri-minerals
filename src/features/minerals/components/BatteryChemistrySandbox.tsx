import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Mineral } from '../schema/mineralSchema';

interface BatteryChemistrySandboxProps {
  mineral: Mineral;
}

export default function BatteryChemistrySandbox({ mineral }: BatteryChemistrySandboxProps) {
  const [nmcShare, setNmcShare] = useState(50);
  const [lfpShare, setLfpShare] = useState(30);
  const [solidStateShare, setSolidStateShare] = useState(20);

  // Normalize shares to 100%
  const total = nmcShare + lfpShare + solidStateShare;
  const nmcNorm = total === 0 ? 33.33 : (nmcShare / total) * 100;
  const lfpNorm = total === 0 ? 33.33 : (lfpShare / total) * 100;
  const solidStateNorm = total === 0 ? 33.33 : (solidStateShare / total) * 100;

  // Calculate demand projections (mock logic)
  const projectionData = useMemo(() => {
    const currentDemand = 200; // base demand index

    // Impact logic:
    let nmcFactor = 1;
    let lfpFactor = 1;
    let ssFactor = 1;

    if (mineral.slug === 'cobalt') {
      nmcFactor = 1.2; 
      lfpFactor = 0;   
      ssFactor = 0.2;  
    } else if (mineral.slug === 'lithium') {
      nmcFactor = 1;
      lfpFactor = 1.1; 
      ssFactor = 1.5;
    } else if (mineral.slug === 'nickel') {
      nmcFactor = 1.5;
      lfpFactor = 0;
      ssFactor = 0.5;
    } else if (mineral.slug === 'graphite') {
      nmcFactor = 1;
      lfpFactor = 1;
      ssFactor = 0; // Solid state often uses lithium-metal anode, replacing graphite
    }

    const data = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      const baseGrowth = Math.pow(1.05, i);
      
      const weightedDemand = (
        (nmcNorm / 100) * nmcFactor + 
        (lfpNorm / 100) * lfpFactor + 
        (solidStateNorm / 100) * ssFactor
      ) * currentDemand * baseGrowth;

      data.push({
        year,
        demand: Math.round(weightedDemand)
      });
    }
    return data;
  }, [mineral.slug, nmcNorm, lfpNorm, solidStateNorm]);

  const isBatteryMetal = ['lithium', 'cobalt', 'nickel', 'graphite'].includes(mineral.slug);

  if (!isBatteryMetal) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-glass mt-8 text-center text-slate-500">
        <p>Battery Chemistry Sandbox is only applicable for battery metals (Lithium, Cobalt, Nickel, Graphite).</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-glass mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Battery Chemistry Sandbox
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Adjust projected EV battery market share to see how substitutability impacts {mineral.name} demand.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Sliders */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-300">NMC 811 (High Nickel)</label>
              <span className="text-sm font-mono text-white">{nmcNorm.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={nmcShare}
              onChange={(e) => setNmcShare(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-300">LFP (Zero Cobalt/Nickel)</label>
              <span className="text-sm font-mono text-white">{lfpNorm.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={lfpShare}
              onChange={(e) => setLfpShare(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-300">Solid State (Next-Gen)</label>
              <span className="text-sm font-mono text-white">{solidStateNorm.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={solidStateShare}
              onChange={(e) => setSolidStateShare(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-sm text-amber-200/90 leading-relaxed">
            <strong>Insight:</strong> 
            {mineral.slug === 'cobalt' && ' Increasing LFP adoption directly eliminates demand for cobalt. Notice how shifting to LFP flattens the curve.'}
            {mineral.slug === 'lithium' && ' LFP actually requires a slightly higher lithium intensity per kWh compared to NMC.'}
            {mineral.slug === 'nickel' && ' LFP contains no nickel, making nickel demand highly sensitive to NMC dominance.'}
            {mineral.slug === 'graphite' && ' Solid-state batteries often use lithium-metal anodes, potentially eliminating graphite from those cells.'}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 lg:h-[300px] relative pt-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center absolute -top-2 left-0 right-0">Global {mineral.name} Demand Projection</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mineral.color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={mineral.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${value} Index`, 'Demand']}
              />
              <Area 
                type="monotone" 
                dataKey="demand" 
                stroke={mineral.color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorDemand)" 
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
