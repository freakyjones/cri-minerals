import { FileText, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { Mineral } from '../../minerals/schema/mineralSchema';

interface SupplyChainAnalyticsProps {
  selectedMineral: Mineral | null;
  isMobile: boolean;
}

export default function SupplyChainAnalytics({
  selectedMineral,
  isMobile
}: SupplyChainAnalyticsProps) {
  return (
    <div className={`w-full md:w-[360px] flex-shrink-0 border-l border-slate-800 bg-slate-950/80 z-20 flex flex-col md:h-full overflow-hidden transition-all duration-300 ${isMobile && selectedMineral ? 'h-[40vh]' : isMobile ? 'h-0 border-none' : 'h-auto'}`}>
      {selectedMineral ? (
        <>
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/50">
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
              {/* eslint-disable-next-line react/forbid-dom-props */}
              <span className="w-4 h-4 rounded shadow-sm block" style={{ backgroundColor: selectedMineral.color }}></span>
              {selectedMineral.name}
            </h2>
            <p className="text-sm font-mono text-slate-400">{selectedMineral.symbol} • {selectedMineral.category}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Market Data (LME)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">Current Price</p>
                  <p className="font-mono text-white text-lg">--- <span className="text-xs text-slate-400">/t</span></p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">24h Change</p>
                  <p className="font-mono text-lg text-slate-400">---%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Risk Analysis
              </h3>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Supply Risk Factor</span>
                  <span className="font-mono text-orange-400 font-bold">{selectedMineral.riskScore}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
                  {/* eslint-disable-next-line react/forbid-dom-props */}
                  <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: selectedMineral.riskScore === 'CRITICAL' ? '100%' : selectedMineral.riskScore === 'HIGH' ? '75%' : selectedMineral.riskScore === 'MEDIUM' ? '50%' : '25%' }}></div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High concentration of refining capacity creates significant supply chain vulnerability, compounded by strict export regulations in primary producing regions.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" /> Dependencies
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 rounded-lg p-3 flex items-center justify-between group">
                  <span className="text-sm text-slate-300">Upstream Extraction</span>
                  <ArrowRightLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </button>
                <button className="w-full text-left bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 rounded-lg p-3 flex items-center justify-between group">
                  <span className="text-sm text-slate-300">Downstream EV Mfg</span>
                  <ArrowRightLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 hidden md:flex">
          <FileText className="w-12 h-12 mb-4 text-slate-800" />
          <p>Select a mineral to view detailed analytics and risk profiles.</p>
        </div>
      )}
    </div>
  );
}
