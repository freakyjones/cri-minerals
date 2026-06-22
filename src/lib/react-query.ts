import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Critical minerals data updates infrequently
      gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
      refetchOnWindowFocus: false, // Prevent flickering and DB hits on tab switch
      retry: 1, // Only retry once on failure to prevent long loading states on bad connections
    },
  },
});
