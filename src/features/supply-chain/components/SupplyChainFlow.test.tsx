import { describe, it, expect } from 'vitest';
import { generateSankeyData } from './SupplyChainFlow.utils';
import { Mineral } from '../../minerals/schema/mineralSchema';

describe('SupplyChainFlow - generateSankeyData', () => {
  it('should return empty nodes and links if mineral is null', () => {
    const result = generateSankeyData(null);
    expect(result).toEqual({ nodes: [], links: [] });
  });

  it('should correctly aggregate shares from extraction to refining to applications', () => {
    const mockMineral = {
      color: '#ff0000',
      production: [
        { country: 'Country A', share: 60 },
        { country: 'Country B', share: 40 },
      ],
      refining: [
        { country: 'Country C', share: 80 },
        { country: 'Country D', share: 20 },
      ],
      useCases: [
        { label: 'Use Case X', share: 70 },
        { label: 'Use Case Y', share: 30 },
      ],
    } as unknown as Mineral;

    const { nodes, links } = generateSankeyData(mockMineral);

    // Should create nodes for each unique entity + prefix
    expect(nodes).toHaveLength(6);
    expect(nodes.map(n => n.name)).toContain('Ext: Country A');
    expect(nodes.map(n => n.name)).toContain('Ref: Country C');
    expect(nodes.map(n => n.name)).toContain('Use: Use Case X');

    // Expected links from Ext -> Ref
    // Country A (60) to Country C (80%) = 60 * 0.8 = 48
    // Country A (60) to Country D (20%) = 60 * 0.2 = 12
    // Country B (40) to Country C (80%) = 40 * 0.8 = 32
    // Country B (40) to Country D (20%) = 40 * 0.2 = 8

    // Expected links from Ref -> Use
    // Country C (80) to Use Case X (70%) = 80 * 0.7 = 56
    // Country C (80) to Use Case Y (30%) = 80 * 0.3 = 24
    // Country D (20) to Use Case X (70%) = 20 * 0.7 = 14
    // Country D (20) to Use Case Y (30%) = 20 * 0.3 = 6

    expect(links).toHaveLength(8);

    const linkExtAToRefC = links.find(
      l => nodes[l.source].name === 'Ext: Country A' && nodes[l.target].name === 'Ref: Country C'
    );
    expect(linkExtAToRefC?.value).toBe(48);

    const linkRefDToUseX = links.find(
      l => nodes[l.source].name === 'Ref: Country D' && nodes[l.target].name === 'Use: Use Case X'
    );
    expect(linkRefDToUseX?.value).toBe(14);
  });
  
  it('should filter out tiny dust links', () => {
    const mockMineral = {
      color: '#ff0000',
      production: [
        { country: 'Country A', share: 0.5 },
      ],
      refining: [
        { country: 'Country C', share: 1 },
      ],
      useCases: [],
    } as unknown as Mineral;
    
    // totalRefining is 1
    // value = 0.5 * (1 / 1) = 0.5. The filter is > 0.5, so it should be excluded
    const { links } = generateSankeyData(mockMineral);
    expect(links).toHaveLength(0);
  });
});
