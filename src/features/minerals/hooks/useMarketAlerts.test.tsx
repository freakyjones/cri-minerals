import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMarketAlerts } from './useMarketAlerts';
import * as api from '../../../services/api';
import React from 'react';

// Mock the API layer
vi.mock('../../../services/api', () => ({
  fetchMarketAlertsFromDB: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useMarketAlerts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('returns empty array and loading state initially', async () => {
    vi.mocked(api.fetchMarketAlertsFromDB).mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useMarketAlerts(), { wrapper });
    
    expect(result.current.loading).toBe(true);
    expect(result.current.alerts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetches and returns market alerts successfully', async () => {
    const mockData = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Alert',
        description: 'Test description',
        severity: 'CRITICAL',
        status: 'PUBLISHED',
        created_at: new Date().toISOString()
      }
    ];

    vi.mocked(api.fetchMarketAlertsFromDB).mockResolvedValue(mockData);

    const { result } = renderHook(() => useMarketAlerts(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0].title).toBe('Test Alert');
    expect(result.current.error).toBeNull();
  });

  it('filters out invalid alerts that fail zod schema validation', async () => {
    const mockData = [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Valid Alert',
        description: 'Test description',
        severity: 'CRITICAL',
        status: 'PUBLISHED',
        created_at: new Date().toISOString()
      },
      {
        id: 'invalid-uuid-format',
        title: '', // Invalid empty title
        description: 'Test description',
        severity: 'INVALID_SEVERITY', // Invalid enum
        status: 'PUBLISHED',
        created_at: 'not-a-date'
      }
    ];

    vi.mocked(api.fetchMarketAlertsFromDB).mockResolvedValue(mockData as unknown as api.RawMarketAlertDBRecord[]);

    const { result } = renderHook(() => useMarketAlerts(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only return the valid one
    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0].title).toBe('Valid Alert');
  });

  it('returns error when API fails', async () => {
    const error = new Error('Database connection failed');
    vi.mocked(api.fetchMarketAlertsFromDB).mockRejectedValue(error);

    const { result } = renderHook(() => useMarketAlerts(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Database connection failed');
    expect(result.current.alerts).toEqual([]);
  });
});
