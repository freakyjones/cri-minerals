 
import { describe, it, expect, vi, beforeEach, MockedFunction, Mock } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import AnalystDashboard from '../AnalystDashboard';
import { useTriggerAlerts } from '@/features/minerals/hooks/useMarketAlerts';
import { useAlertQueue } from '@/features/minerals/hooks/useAlertQueue';
import { useQueryClient } from '@tanstack/react-query';

// Mock the child component
vi.mock('../../features/minerals/components/AnalystQueue', () => ({
  default: () => <div data-testid="analyst-queue">Mock AnalystQueue</div>
}));

// Mock hooks
vi.mock('@/features/minerals/hooks/useMarketAlerts');
vi.mock('@/features/minerals/hooks/useAlertQueue');
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

const mockUseTriggerAlerts = useTriggerAlerts as MockedFunction<typeof useTriggerAlerts>;
const mockUseAlertQueue = useAlertQueue as MockedFunction<typeof useAlertQueue>;
const mockUseQueryClient = useQueryClient as MockedFunction<typeof useQueryClient>;

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  RefreshCw: () => <svg data-testid="RefreshCw" />,
  CheckCircle2: () => <svg data-testid="CheckCircle2" />,
  AlertCircle: () => <svg data-testid="AlertCircle" />,
  Clock: () => <svg data-testid="Clock" />,
  Info: () => <svg data-testid="Info" />
}));

describe('AnalystDashboard State Machine', () => {
  let mockMutateAsync: Mock;
  let mockInvalidateQueries: Mock;
  let mockGetQueryData: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMutateAsync = vi.fn().mockResolvedValue({ run_id: 'mock-run-123' });
    (mockUseTriggerAlerts as unknown as Mock).mockReturnValue({
      isPending: false,
      mutateAsync: mockMutateAsync
    });

    (mockUseAlertQueue as unknown as Mock).mockReturnValue({
      status: null
    });

    mockInvalidateQueries = vi.fn().mockResolvedValue(true);
    mockGetQueryData = vi.fn().mockReturnValue([{}, {}]); // 2 draft items

    (mockUseQueryClient as unknown as Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      getQueryData: mockGetQueryData
    });
  });

  it('transitions button states correctly through the job lifecycle', async () => {
    const { rerender } = render(<AnalystDashboard />);
    
    // Initial State
    expect(screen.getByText('Fetch Latest News')).toBeInTheDocument();

    // 1. Starting Job (triggerAlerts.isPending is true)
    (mockUseTriggerAlerts as unknown as Mock).mockReturnValue({ isPending: true, mutateAsync: mockMutateAsync });
    rerender(<AnalystDashboard />);
    expect(screen.getByText('Starting Job...')).toBeInTheDocument();

    // 2. Waiting in Queue (mutation finished, run_id set, status is PENDING)
    (mockUseTriggerAlerts as unknown as Mock).mockReturnValue({ isPending: false, mutateAsync: mockMutateAsync });
    // Simulate setting activeRunId and queueStatus updating
    (mockUseAlertQueue as unknown as Mock).mockImplementation((runId: string | null) => {
      if (runId === 'mock-run-123') return { status: 'PENDING' };
      return { status: null };
    });
    
    // We must trigger the handleTrigger manually to set the state, 
    // but since we can't easily set activeRunId directly without clicking, let's click it.
    // Reset mocks for a fresh run
    (mockUseAlertQueue as unknown as Mock).mockReturnValue({ status: null });
    rerender(<AnalystDashboard />);
    
    act(() => {
      screen.getByText('Fetch Latest News').click();
    });
    
    // Now it should have activeRunId set.
    (mockUseAlertQueue as unknown as Mock).mockReturnValue({ status: 'PENDING' });
    rerender(<AnalystDashboard />);
    expect(screen.getByText('Waiting in Queue...')).toBeInTheDocument();

    // 3. Generating AI Alerts (status is IN_PROGRESS)
    (mockUseAlertQueue as unknown as Mock).mockReturnValue({ status: 'IN_PROGRESS' });
    rerender(<AnalystDashboard />);
    expect(screen.getByText('Generating AI Alerts...')).toBeInTheDocument();

    // 4. Finished (status is COMPLETED)
    (mockUseAlertQueue as unknown as Mock).mockReturnValue({ status: 'COMPLETED' });
    rerender(<AnalystDashboard />);
    
    // It should unlock the button and reset text
    await waitFor(() => {
      expect(screen.getByText('Fetch Latest News')).toBeInTheDocument();
    });
  });

  it('shows toast for successfully generated alerts when draft count increases', async () => {
    const { rerender } = render(<AnalystDashboard />);
    
    // Click button
    act(() => {
      screen.getByText('Fetch Latest News').click();
    });

    // Simulate completion
    (mockUseAlertQueue as unknown as Mock).mockImplementation((runId: string | null) => {
      if (runId === 'mock-run-123') return { status: 'COMPLETED' };
      return { status: null };
    });
    
    // Change draft count to simulate 3 new alerts being fetched
    mockGetQueryData.mockReturnValue([{}, {}, {}, {}, {}]); // 5 items

    rerender(<AnalystDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Successfully generated 3 new alerts!')).toBeInTheDocument();
    });
  });
});
