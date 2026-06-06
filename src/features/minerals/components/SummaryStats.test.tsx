import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SummaryStats from './SummaryStats';
import type { Mineral } from '../schema/mineralSchema';

// Mock a full mineral object
const mockMineral: Mineral = {
  id: "test-mineral",
  slug: "test-mineral",
  name: "Testium",
  symbol: "Ts",
  atomicNumber: 999,
  category: "battery-metal",
  tagline: "Test",
  riskScore: "HIGH",
  color: "#fff",
  useCases: [],
  reserves: [],
  production: [],
  refining: [],
  chokePoints: [],
  dataSources: [],
  substitutability: "LOW",
  recyclingRate: 15,
  recyclingSources: ["Test"],
  // 2 ESG Risks
  esgRisks: [
    { country: "A", category: "HUMAN_RIGHTS", severity: "HIGH", summary: "Risk 1" },
    { country: "B", category: "ENVIRONMENT", severity: "CRITICAL", summary: "Risk 2" }
  ]
};

describe('SummaryStats Component', () => {
  it('renders all four stat headers', () => {
    render(<SummaryStats mineral={mockMineral} />);
    
    expect(screen.getByText('Supply Risk')).toBeInTheDocument();
    expect(screen.getByText('Substitutability')).toBeInTheDocument();
    expect(screen.getByText('Recycling Rate')).toBeInTheDocument();
    expect(screen.getByText('ESG Alerts')).toBeInTheDocument();
  });

  it('renders the correct data values from the mineral prop', () => {
    render(<SummaryStats mineral={mockMineral} />);
    
    // Risk Score
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    
    // Substitutability
    expect(screen.getByText('LOW')).toBeInTheDocument();
    
    // Recycling Rate
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('renders "2 Alerts" in red when there are two ESG risks', () => {
    render(<SummaryStats mineral={mockMineral} />);
    
    const esgBadge = screen.getByText('2 Alerts');
    expect(esgBadge).toBeInTheDocument();
    // Verify it has the red styling class
    expect(esgBadge).toHaveClass('text-red-400');
  });

  it('renders "Clear" in green when there are zero ESG risks', () => {
    const safeMineral = { ...mockMineral, esgRisks: undefined };
    render(<SummaryStats mineral={safeMineral} />);
    
    const esgBadge = screen.getByText('Clear');
    expect(esgBadge).toBeInTheDocument();
    // Verify it has the green styling class
    expect(esgBadge).toHaveClass('text-green-400');
  });
});
