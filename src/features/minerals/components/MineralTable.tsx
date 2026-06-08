import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskIcon, getRiskColorSolid } from '../utils';

interface MineralTableProps {
  minerals: Mineral[];
}

export default function MineralTable({ minerals }: MineralTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-bg-surface border border-white/10 rounded-xl shadow-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/50 border-b border-white/10 text-slate-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Mineral</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Risk Score</th>
              <th className="px-6 py-4 font-medium">Substitutability</th>
              <th className="px-6 py-4 font-medium">Recycling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {minerals.map((mineral) => (
              <tr 
                key={mineral.id}
                onClick={() => navigate(`/mineral/${mineral.slug}`)}
                className="hover:bg-white/5 transition-colors duration-150 group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <Link 
                    to={`/mineral/${mineral.slug}`}
                    className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-md p-1 -m-1"
                  >
                    <span className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                      {mineral.symbol}
                    </span>
                    <div className="font-bold text-white group-hover:text-accent-blue transition-colors">
                      {mineral.name}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-300">{mineral.category}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge className={`${getRiskColorSolid(mineral.riskScore)} border-none font-bold tracking-wider rounded-md text-[10px]`}>
                    {getRiskIcon(mineral.riskScore)} {mineral.riskScore}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    mineral.substitutability === 'HIGH' ? 'text-green-400' :
                    mineral.substitutability === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {mineral.substitutability}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono tabular-nums tracking-tight font-medium ${
                    mineral.recyclingRate >= 50 ? 'text-green-400' :
                    mineral.recyclingRate >= 20 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {mineral.recyclingRate}%
                  </span>
                </td>
              </tr>
            ))}
            {minerals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No minerals match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
