import { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TimelineEvent } from '../schema/mineralSchema';

import { generateMockPriceData } from './MineralTimeline.utils';

interface MineralTimelineProps {
  timeline: TimelineEvent[];
  color: string;
  currentPrice: number | undefined;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export default function MineralTimeline({ timeline, color, currentPrice }: MineralTimelineProps) {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const sorted = useMemo(() => {
    if (!timeline) return [];
    return [...timeline].sort((a, b) => a.year - b.year);
  }, [timeline]);

  // Generate mock historical price data based on currentPrice and timeline range
  const priceData = useMemo(() => {
    return generateMockPriceData(sorted, currentPrice);
  }, [sorted, currentPrice]);

  if (!timeline || timeline.length === 0) return null;

  return (
    <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2 flex items-center gap-2">
        <Clock className="h-5 w-5 text-slate-400" />
        Geopolitical Events & Market Shocks
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Timeline */}
        <div className="relative pr-4">
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Vertical timeline line */}
            <div
              className="absolute left-5 top-[20px] bottom-[20px] w-px opacity-30"
              style={{ backgroundColor: color }} // eslint-disable-line react/forbid-dom-props
            />

            <div className="space-y-6">
              {sorted.map((event, i) => (
                <motion.div
                  key={`${event.year}-${i}`}
                  variants={itemVariants}
                  className="flex gap-4 relative group cursor-pointer"
                  onMouseEnter={() => setActiveYear(event.year)}
                  onMouseLeave={() => setActiveYear(null)}
                >
                  {/* Year marker */}
                  <div className="w-10 flex flex-col items-center shrink-0 z-10 pt-[15px]">
                    <div
                      className={`w-[10px] h-[10px] rounded-full ring-4 transition-all duration-300 ${activeYear === event.year ? 'ring-white scale-125' : 'ring-bg-surface'}`}
                      style={{ backgroundColor: color }} // eslint-disable-line react/forbid-dom-props
                    />
                  </div>

                  {/* Event card */}
                  <div className={`bg-black/30 border rounded-lg p-4 flex-1 -mt-1 transition-all duration-300 ${activeYear === event.year ? 'border-white/30 shadow-lg' : 'border-white/5'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-sm font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${color}20`, color }} // eslint-disable-line react/forbid-dom-props
                      >
                        {event.year}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed mb-1 group-hover:text-accent-blue transition-colors">
                      {event.event}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {event.impact}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Price Chart */}
        <div className="hidden xl:block relative h-full">
          <div className="sticky top-24 h-[400px] border border-white/5 rounded-xl bg-black/20 p-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
               Historical Price Index (USD/mt)
               <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">SIMULATED</span>
             </h3>
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={priceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <XAxis dataKey="year" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                 <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                   itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                   labelStyle={{ color: '#94a3b8' }}
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Price']}
                 />
                 <Line 
                   type="monotone" 
                   dataKey="price" 
                   stroke={color} 
                   strokeWidth={2} 
                   dot={false}
                   activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
                 />
                 {activeYear && (
                   <ReferenceLine 
                     x={activeYear} 
                     stroke="#f8fafc" 
                     strokeDasharray="3 3" 
                     label={{ position: 'top', value: 'Market Shock', fill: '#f8fafc', fontSize: 11, fontWeight: 'bold' }} 
                   />
                 )}
               </LineChart>
             </ResponsiveContainer>
             <div className="mt-4 text-xs text-center text-slate-500 italic">
               Hover over timeline events to see market reactions.
             </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
