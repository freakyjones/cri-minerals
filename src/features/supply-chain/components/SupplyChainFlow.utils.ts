import type { Mineral } from '../../minerals/schema/mineralSchema';

export function generateSankeyData(mineral: Mineral | null) {
  if (!mineral) return { nodes: [], links: [] };

  const nodes: { name: string; fill: string }[] = [];
  const links: { source: number; target: number; value: number }[] = [];
  
  // We prefix names to ensure uniqueness across the 3 stages
  const extPrefix = 'Ext: ';
  const refPrefix = 'Ref: ';
  const usePrefix = 'Use: ';

  // Helper to get or create node index
  const getNodeIndex = (name: string, type: 'ext' | 'ref' | 'use') => {
    const idx = nodes.findIndex(n => n.name === name);
    if (idx !== -1) return idx;
    
    const color = type === 'ext' ? '#f59e0b' : type === 'ref' ? '#ef4444' : mineral.color;
    nodes.push({ name, fill: color });
    return nodes.length - 1;
  };

  // 1. Build Nodes & Links from Extraction -> Refining
  // To visualize flow without point-to-point data, we distribute extraction proportionally to refining
  const totalRefining = mineral.refining.reduce((sum, r) => sum + r.share, 0) || 100;
  
  mineral.production.forEach(ext => {
    const sourceIdx = getNodeIndex(extPrefix + ext.country, 'ext');
    mineral.refining.forEach(ref => {
      const targetIdx = getNodeIndex(refPrefix + ref.country, 'ref');
      // Link value is the extraction share * the proportion of this refining hub
      const value = ext.share * (ref.share / totalRefining);
      if (value > 0.5) { // filter out tiny dust links
        links.push({ source: sourceIdx, target: targetIdx, value });
      }
    });
  });

  // 2. Build Nodes & Links from Refining -> End Use Cases
  const totalUseCases = mineral.useCases.reduce((sum, u) => sum + u.share, 0) || 100;

  mineral.refining.forEach(ref => {
    const sourceIdx = getNodeIndex(refPrefix + ref.country, 'ref');
    mineral.useCases.forEach(use => {
      const targetIdx = getNodeIndex(usePrefix + use.label, 'use');
      const value = ref.share * (use.share / totalUseCases);
      if (value > 0.5) {
        links.push({ source: sourceIdx, target: targetIdx, value });
      }
    });
  });

  return { nodes, links };
}
