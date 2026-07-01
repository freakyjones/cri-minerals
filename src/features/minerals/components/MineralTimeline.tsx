import { motion, Variants } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { TimelineEvent } from '../schema/mineralSchema';

interface MineralTimelineProps {
  timeline: TimelineEvent[];
  color: string;
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

export default function MineralTimeline({ timeline, color }: MineralTimelineProps) {
  if (!timeline || timeline.length === 0) return null;

  // Sort chronologically
  const sorted = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2 flex items-center gap-2">
        <Clock className="h-5 w-5 text-slate-400" />
        Key Events
      </h2>

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
              className="flex gap-4 relative"
            >
              {/* Year marker */}
              <div className="w-10 flex flex-col items-center shrink-0 z-10 pt-[15px]">
                <div
                  className="w-[10px] h-[10px] rounded-full ring-4 ring-bg-surface"
                  style={{ backgroundColor: color }} // eslint-disable-line react/forbid-dom-props
                />
              </div>

              {/* Event card */}
              <div className="bg-black/30 border border-white/5 rounded-lg p-4 flex-1 -mt-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${color}20`, color }} // eslint-disable-line react/forbid-dom-props
                  >
                    {event.year}
                  </span>
                </div>
                <p className="text-sm font-medium text-white leading-relaxed mb-1">
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
    </Card>
  );
}
