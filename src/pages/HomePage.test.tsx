import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock the public API hook directly
vi.mock('../features/minerals', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../features/minerals')>();
  return {
    ...actual,
    useMineralDashboard: () => ({
      loading: false,
      activeCategory: 'all',
      setActiveCategory: vi.fn(),
      activeRisk: null,
      setActiveRisk: vi.fn(),
      categories: [
        { label: 'All', value: 'all' },
        { label: 'Battery Metals', value: 'battery-metal' }
      ],
      filteredMinerals: [
        { id: '1', slug: 'lithium', name: 'Lithium', symbol: 'Li', category: 'battery-metal', riskScore: 'HIGH', useCases: [] },
        { id: '2', slug: 'cobalt', name: 'Cobalt', symbol: 'Co', category: 'battery-metal', riskScore: 'CRITICAL', useCases: [] },
        { id: '3', slug: 'gallium', name: 'Gallium', symbol: 'Ga', category: 'semiconductor', riskScore: 'CRITICAL', useCases: [] }
      ],
      riskCounts: { CRITICAL: 6, HIGH: 4, MEDIUM: 0, LOW: 0 }
    }),
  };
});

describe('HomePage Integration', () => {
  it('renders the dashboard header and subtitle', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Critical Minerals Intelligence')).toBeInTheDocument();
    expect(screen.getByText(/Monitoring 20 critical minerals/i)).toBeInTheDocument();
  });

  it('renders the Intelligence Index table with the filteredMinerals array', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Lithium')).toBeInTheDocument();
    expect(screen.getByText('Cobalt')).toBeInTheDocument();
    expect(screen.getByText('Gallium')).toBeInTheDocument();
  });

  it('renders the risk heatmap with accessible labels', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Critical Risk')).toBeInTheDocument();
    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });
});
