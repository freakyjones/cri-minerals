import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMinerals, useMineral } from './useMineral';
import { mineralService } from '../services/mineralService';
import type { Mineral } from '../schema/mineralSchema';

// Mock the API calls
vi.mock('../services/mineralService', () => ({
  mineralService: {
    getMinerals: vi.fn(),
    getMineralBySlug: vi.fn(),
  }
}));

// Helper to create a clean QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for faster testing
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

const mockMineralData: Mineral = {
  id: '123',
  slug: 'lithium',
  name: 'Lithium',
  symbol: 'Li',
  atomicNumber: 3,
  category: 'battery-metal',
  riskScore: 'HIGH',
  color: '#ff0000',
  tagline: 'Battery stuff',
  substitutability: 'LOW',
  recyclingRate: 10,
  recyclingSources: ['Batteries'],
  reserves: [],
  production: [],
  refining: [],
  chokePoints: [],
  dataSources: [],
  useCases: [],
};

describe('useMineral Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMinerals', () => {
    it('should fetch and return minerals', async () => {
      vi.mocked(mineralService.getMinerals).mockResolvedValue([mockMineralData]);

      const { result } = renderHook(() => useMinerals(), { wrapper });

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for React Query to resolve
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.minerals).toHaveLength(1);
      expect(result.current.minerals[0].slug).toBe('lithium');
      expect(result.current.error).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mineralService.getMinerals).mockRejectedValue(new Error('API Failure'));

      const { result } = renderHook(() => useMinerals(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.minerals).toEqual([]);
      expect(result.current.error?.message).toBe('API Failure');
    });
  });

  describe('useMineral', () => {
    it('should fetch a single mineral by slug', async () => {
      vi.mocked(mineralService.getMineralBySlug).mockResolvedValue(mockMineralData);

      const { result } = renderHook(() => useMineral('lithium'), { wrapper });

      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.mineral?.slug).toBe('lithium');
    });

    it('should not fetch if slug is undefined', () => {
      const { result } = renderHook(() => useMineral(undefined), { wrapper });

      expect(result.current.loading).toBe(false);
      expect(result.current.mineral).toBeNull();
      expect(mineralService.getMineralBySlug).not.toHaveBeenCalled();
    });
  });
});
