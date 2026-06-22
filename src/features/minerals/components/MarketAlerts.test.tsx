import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MarketAlerts from './MarketAlerts';
import * as hooks from '../hooks/useMarketAlerts';

vi.mock('../hooks/useMarketAlerts', () => ({
  useMarketAlerts: vi.fn(),
}));

describe('MarketAlerts Component', () => {
  it('renders skeleton loading state', () => {
    vi.mocked(hooks.useMarketAlerts).mockReturnValue({
      alerts: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = render(
      <BrowserRouter>
        <MarketAlerts />
      </BrowserRouter>
    );
    // There are 3 skeleton items rendered
    expect(container.getElementsByClassName('animate-pulse').length).toBe(3);
  });

  it('renders error state', () => {
    vi.mocked(hooks.useMarketAlerts).mockReturnValue({
      alerts: [],
      loading: false,
      error: new Error('Failed to fetch'),
      refetch: vi.fn(),
    });

    render(
      <BrowserRouter>
        <MarketAlerts />
      </BrowserRouter>
    );
    expect(screen.getByText('Failed to load alerts.')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders empty state when no alerts exist', () => {
    vi.mocked(hooks.useMarketAlerts).mockReturnValue({
      alerts: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <BrowserRouter>
        <MarketAlerts />
      </BrowserRouter>
    );
    expect(screen.getByText('No active alerts at this time.')).toBeInTheDocument();
  });

  it('renders alerts with severity icons', () => {
    vi.mocked(hooks.useMarketAlerts).mockReturnValue({
      alerts: [
        {
          id: '1',
          title: 'Critical Supply Chain Issue',
          description: 'A major disruption has occurred.',
          severity: 'CRITICAL',
          status: 'PUBLISHED',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Minor Delay',
          description: 'A minor delay in shipping.',
          severity: 'LOW',
          status: 'PUBLISHED',
          created_at: new Date().toISOString()
        }
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <BrowserRouter>
        <MarketAlerts />
      </BrowserRouter>
    );
    expect(screen.getByText('Critical Supply Chain Issue')).toBeInTheDocument();
    expect(screen.getByText('A major disruption has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Minor Delay')).toBeInTheDocument();
  });
});
