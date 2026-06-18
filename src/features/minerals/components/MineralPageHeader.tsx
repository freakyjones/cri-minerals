import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Mineral } from '../schema/mineralSchema';
import { getRiskColorSolid, getRiskIcon } from '../utils';
import { Download, FileText, FileJson, File, Loader2 } from 'lucide-react';
import { exportAsJson, exportAsMarkdown, exportAsPdf } from '../utils/exportUtils';

interface MineralPageHeaderProps {
  mineral: Mineral;
}

export default function MineralPageHeader({ mineral }: MineralPageHeaderProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'md' | 'json') => {
    setIsExportOpen(false);
    setIsExporting(true);
    try {
      if (format === 'json') await exportAsJson(mineral);
      else if (format === 'md') await exportAsMarkdown(mineral);
      else if (format === 'pdf') await exportAsPdf(mineral);
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="mb-8 border-b border-white/10 pb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.span layoutId={`symbol-${mineral.slug}`} className="text-4xl md:text-5xl font-bold text-slate-200">
            {mineral.symbol}
          </motion.span>
          <motion.div layoutId={`risk-${mineral.slug}`}>
            <Badge className={`${getRiskColorSolid(mineral.riskScore)} border-none font-bold tracking-wider rounded-md`}>
              {getRiskIcon(mineral.riskScore)} {mineral.riskScore} RISK
            </Badge>
          </motion.div>
          <Badge variant="outline" className="text-gray-400 border-gray-700 uppercase">
            {mineral.category}
          </Badge>
        </div>

        {/* Export Report Dropdown */}
        <div className="relative inline-block z-50">
          <button 
            onClick={() => !isExporting && setIsExportOpen(!isExportOpen)}
            disabled={isExporting}
            className="hidden sm:flex items-center gap-2 bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue outline-none disabled:opacity-70 disabled:cursor-not-allowed" 
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
          
          <AnimatePresence>
            {isExportOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-md shadow-xl overflow-hidden"
              >
                <button onClick={() => handleExport('pdf')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors focus:bg-white/5 focus:outline-none">
                  <FileText className="h-4 w-4 text-rose-400" /> PDF Document
                </button>
                <button onClick={() => handleExport('md')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors focus:bg-white/5 focus:outline-none">
                  <File className="h-4 w-4 text-sky-400" /> Markdown
                </button>
                <button onClick={() => handleExport('json')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors focus:bg-white/5 focus:outline-none">
                  <FileJson className="h-4 w-4 text-emerald-400" /> JSON Data
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <motion.h1 layoutId={`name-${mineral.slug}`} className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
        {mineral.name}
      </motion.h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">{mineral.tagline}</p>
    </header>
  );
}
