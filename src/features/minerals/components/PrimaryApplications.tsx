import { Card } from '@/components/ui/card';
import type { Mineral } from '../schema/mineralSchema';

interface PrimaryApplicationsProps {
  useCases: Mineral['useCases'];
}

export default function PrimaryApplications({ useCases }: PrimaryApplicationsProps) {
  return (
    <Card className="bg-bg-surface border-white/10 p-6 shadow-glass">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">Primary Applications</h2>
      <ul className="space-y-4">
        {useCases.map((uc, i) => (
          <li key={i} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">{uc.label}</span>
              <span className="font-bold text-accent-blue">{uc.share}%</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2">
              {/* eslint-disable-next-line react/forbid-dom-props */}
              <div className="bg-accent-blue h-2 rounded-full" style={{ width: `${uc.share}%` }}></div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
